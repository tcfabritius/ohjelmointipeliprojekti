from flask import Flask, Response, request, jsonify
from dbconf import db
from flask_cors import CORS
import json
import traceback
from geopy import distance
import mysql.connector

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def calcCO2(icao1, icao2):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    cursor = yhteys.cursor()
    cursor.execute("SELECT latitude_deg, longitude_deg from airport where ident = %s", (icao1,))
    sijainti1 = cursor.fetchall()
    cursor = yhteys.cursor()
    cursor.execute("SELECT latitude_deg, longitude_deg from airport where ident = %s", (icao2,))
    sijainti2 = cursor.fetchall()
    valimatka = int(distance.distance(sijainti1, sijainti2).km)
    if valimatka < 1500:
        paastot = valimatka * 225
    else:
        paastot = valimatka * 120
    cursor.close()
    return paastot

def calcPrice(icao1, icao2):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    cursor = yhteys.cursor(buffered=True)
    cursor.execute("select latitude_deg, longitude_deg from airport where ident = %s", (icao1,))
    sijainti1 = cursor.fetchall()
    cursor = yhteys.cursor(buffered=True)
    cursor.execute("select latitude_deg, longitude_deg from airport where ident = %s", (icao2,))
    sijainti2 = cursor.fetchall()
    hinta = int(distance.distance(sijainti1, sijainti2).km) * 1
    return hinta

@app.after_request
def apply_cors(response):
    if request.environ.get('HTTP_ORIGIN'):
        response.headers['Access-Control-Allow-Origin'] = request.environ['HTTP_ORIGIN']
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.route('/')
def hello_world():
    return 'Hello from Flask!'


# Assuming a database connection is set up elsewhere
# connection = mysql.connector.connect(...)

@app.route('/init/<pelaaja>')
def init(pelaaja):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200

    try:
        kursori = yhteys.cursor(buffered=True)
        # Check if the player already exists
        kursori.execute("SELECT COUNT(*) FROM game WHERE id = %s", (pelaaja,))
        result = kursori.fetchone()

        if result[0] > 0:
            response_data = {"exists": True, "status": 200}
            return jsonify(response_data), 200
        else:
            # Create a new player
            kursori.execute("INSERT INTO game(id) VALUES (%s)", (pelaaja,))
            yhteys.commit()

            # Assign default values for the new player
            default_location = "EFHK"

            kysely = "UPDATE game SET co2_consumed = %s, co2_budget = %s, location = %s, screen_name=%s, money = %s, threat = %s WHERE id = %s"
            kursori.execute(kysely, (0, 1000, default_location, "", 1000, 0, pelaaja))

            yhteys.commit()

            response_data = {"exists": False, "status": 200}
            return jsonify(response_data), 200

    except Exception as e:
        print(f"Error: {e}")
        error_trace = traceback.format_exc()
        return jsonify({
            "error": "An error occurred during initialization.",
            "traceback": error_trace
        }), 500

    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/delete/<pelaaja>')
def delete(pelaaja):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500,
                        mimetype="application/json")
    tilakoodi = 200

    try:
        kursori = yhteys.cursor(buffered=True)
        # Check if the player already exists
        kursori.execute("SELECT COUNT(*) FROM game WHERE id = %s", (pelaaja,))
        result = kursori.fetchone()

        if result[0] > 0:
            kursori = yhteys.cursor()
            kursori.execute("DELETE FROM game WHERE id = %s", (pelaaja,))
            kursori.execute("DELETE FROM mission_accomplished WHERE game_id = %s", (pelaaja,))
            kursori.close()
            response_data = {"exists": True, "status": 200}
            return jsonify(response_data), 200
        else:
            response_data = {"exists": False, "status": 200}
            return jsonify(response_data), 200
    except Exception as e:
        print(f"Error: {e}")
        error_trace = traceback.format_exc()
        return jsonify({
            "error": "An error occurred during initialization.",
            "traceback": error_trace
        }), 500

    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/pay/<pelaaja>/<multiplier>/<mission>')
def pay(pelaaja, multiplier, mission):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")

    tilakoodi = 200

    try:
        kursori = yhteys.cursor()
        # Fetch the current money value
        kursori.execute("SELECT money FROM game WHERE id = %s", (pelaaja,))
        old_money = kursori.fetchone()
        old_money = int(old_money[0])


        kursori = yhteys.cursor()
        kursori.execute("SELECT pay FROM mission WHERE id = %s", (mission,))
        salary = kursori.fetchone()
        salary = int(salary[0])
        current_money = int(multiplier) * salary + old_money
        kursori.execute("UPDATE game SET money = %s WHERE id = %s", (current_money, pelaaja,))
        yhteys.commit()
        kursori.close()
        response_data = {"money": current_money, "status": 200}
        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error: {e}")
        error_trace = traceback.format_exc()
        return jsonify({
                "error": "An error occurred during initialization.",
                "traceback": error_trace
            }), 500

    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/bonus/<pelaaja>/<arvo>')
def bonus(pelaaja, arvo):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")

    tilakoodi = 200

    try:
        kursori = yhteys.cursor()
        # Fetch the current money value
        kursori.execute("SELECT money FROM game WHERE id = %s", (pelaaja,))
        result = kursori.fetchone()

        if not result:
            return jsonify({"status": 404, "error": "Player not found"}), 404

        # Calculate new money value
        current_money = int(result[0]) + int(arvo)

        # Update the database
        kursori.execute("UPDATE game SET money = %s WHERE id = %s", (current_money, pelaaja))
        yhteys.commit()

        # Return success response
        return jsonify({"money": current_money, "status": 200}), 200

    except Exception as e:
        print(f"Error: {e}")
        error_trace = traceback.format_exc()
        return jsonify({
                "error": "An error occurred during initialization.",
                "traceback": error_trace
            }), 500

    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/matkusta/<pelaaja>/<kohde>')
def matkusta(pelaaja, kohde):
    # HUOM LISÄÄ HÄVIÄMISMAHDOLLISUUS JA THREATIN LASKU!
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200
    try:
        sql_kysely = f"select * from game where id = '{pelaaja}'"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        if not tulos:
            tilakoodi = 404
            vastaus = {"status": tilakoodi, "teksti": "Ei tuloksia"}
            return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")
        nyksijainti = tulos[0][3]
        raha = tulos[0][5]
        threat = tulos[0][6]

        # Calculate price and CO2
        hinta = calcPrice(nyksijainti, kohde)
        co2 = calcCO2(nyksijainti, kohde)
        if hinta > raha:
            vastaus = {
                "status": tilakoodi,
                "travelled": False,
                "nykyinensijainti": nyksijainti,
                "raha": raha,
                "hinta": hinta,
                "co2": co2,
                "tulos": tulos
            }
            jsonvast = json.dumps(vastaus)
            return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")
        else:
            kysely = """
            UPDATE game
            SET location = %s,
                co2_consumed = co2_consumed + %s,
                money = money - %s,
                threat = threat - 20
            WHERE id = %s
            """
            kursori.execute(kysely, (kohde, co2, hinta, pelaaja))
            yhteys.commit()
            sql_kysely = f"select * from game where id = '{pelaaja}'"
            kursori = yhteys.cursor()
            kursori.execute(sql_kysely)
            tulos = kursori.fetchall()
            if not tulos:
                tilakoodi = 404
                vastaus = {"status": tilakoodi, "teksti": "Ei tuloksia"}
                return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")
            nyksijainti = tulos[0][3]
            raha = tulos[0][5]
            threat = tulos[0][6]
            sql_kysely = f"select * from airport where ident = '{kohde}'"
            kursori = yhteys.cursor()
            kursori.execute(sql_kysely)
            tulos = kursori.fetchall()
            if not tulos:
                tilakoodi = 404
                vastaus = {"status": tilakoodi, "teksti": "Ei tuloksia"}
                return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

            vastaus = {
                "status": tilakoodi,
                "travelled": True,
                "nykyinensijainti": nyksijainti,
                "raha": raha,
                "hinta": hinta,
                "co2": co2,
                "threat": threat,
                "latitude_deg": tulos[0][4],
                "longitude_deg": tulos[0][5]
            }

            jsonvast = json.dumps(vastaus)
            return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")
    except Exception as e:
        tilakoodi = 500
        vastaus = {"status": tilakoodi, "error": str(e)}
        return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")
    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/raiseThreat/<pelaaja>/<arvo>')
def raiseThreat(pelaaja,arvo):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200
    try:
        sql_kysely = f"select * from game where id = '{pelaaja}'"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        if not tulos:
            tilakoodi = 404
            vastaus = {"status": tilakoodi, "teksti": "Ei tuloksia"}
            return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")
        threat = tulos[0][6]
        kursori = yhteys.cursor()
        kysely = """
            UPDATE game
            SET threat = threat + %s
            WHERE id = %s
            """
        kursori.execute(kysely, (arvo, pelaaja))
        yhteys.commit()
        sql_kysely = f"select * from game where id = '{pelaaja}'"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        if not tulos:
            tilakoodi = 404
            vastaus = {"status": tilakoodi, "teksti": "Ei tuloksia"}
            return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")
        threat = tulos[0][6]
        vastaus = {
            "status": tilakoodi,
            "threat": threat
            }
        jsonvast = json.dumps(vastaus)
        return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")
    except Exception as e:
        tilakoodi = 500
        vastaus = {"status": tilakoodi, "error": str(e)}
        return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")
    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/getLocation/<pelaaja>')
def getLocation(pelaaja):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200
    try:
        sql_kysely = f"select * from game where id = '{pelaaja}'"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        if not tulos:
            tilakoodi = 404
            vastaus = {"status": tilakoodi, "teksti": "Ei tuloksia"}
            return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")
        sijainti = tulos[0][3]
        sql_kysely = f"select * from airport where ident = '{sijainti}'"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        if not tulos:
            tilakoodi = 404
            vastaus = {"status": tilakoodi, "teksti": "Ei tuloksia"}
            return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")
        vastaus = {
                "status": tilakoodi,
                "latitude_deg": tulos[0][4],
                "longitude_deg": tulos[0][5]
        }

        jsonvast = json.dumps(vastaus)
        return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")
    except Exception as e:
        tilakoodi = 500
        vastaus = {"status": tilakoodi, "error": str(e)}
        return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")
    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/randomize')
def randomize():
    yhteys = db()
    if not yhteys.is_connected():
        return Response(
            response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}),
            status=500,
            mimetype="application/json"
        )

    try:
        countries = []
        airports = []
        kursori = yhteys.cursor()

        for _ in range(3):
            countries_sql = "SELECT iso_country FROM country ORDER BY RAND() LIMIT 1"
            kursori.execute(countries_sql)
            tulos = kursori.fetchall()
            if not tulos:
                return Response(
                    response=json.dumps({"status": 404, "teksti": "Ei tuloksia"}),
                    status=404,
                    mimetype="application/json"
                )
            countries.append(tulos[0][0])
            airports_sql = f"SELECT ident FROM airport WHERE iso_country = '{tulos[0][0]}' ORDER BY RAND() LIMIT 1"
            kursori.execute(airports_sql)
            tulos = kursori.fetchall()
            if not tulos:
                return Response(
                    response=json.dumps({"status": 404, "teksti": "Ei tuloksia"}),
                    status=404,
                    mimetype="application/json"
                )
            airports.append(tulos[0][0])

        vastaus = {
            "status": 200,
            "data": [
                {"country": countries[0], "airport": airports[0]},
                {"country": countries[1], "airport": airports[1]},
                {"country": countries[2], "airport": airports[2]},
            ]
        }
        return Response(
            response=json.dumps(vastaus),
            status=200,
            mimetype="application/json"
        )

    except Exception as e:
        return Response(
            response=json.dumps({"status": 500, "error": str(e)}),
            status=500,
            mimetype="application/json"
        )

    finally:
        if kursori:
            kursori.close()
        if yhteys.is_connected():
            yhteys.close()


@app.route('/kentat')
def kentat():
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200
    try:
        sql_kysely = "select * from airport"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        columns = [
            "id", "ident", "type", "name", "latitude_deg", "longitude_deg",
            "elevation_ft", "continent", "iso_country", "iso_region", "municipality",
            "scheduled_service", "gps_code", "iata_code", "local_code", "home_link",
            "wikipedia_link", "keywords"
        ]
        data = [dict(zip(columns, row)) for row in tulos]
        vastaus = {
            "status": tilakoodi,
            "airports": data
        }
        jsonvast = json.dumps(vastaus)
        return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")

    except Exception as e:
        tilakoodi = 500
        vastaus = {"status": tilakoodi, "error": str(e)}
        return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()


@app.route('/kentta/<icao>')
def kentta(icao):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200
    try:
        sql_kysely = f"select * from airport where ident = '{icao}'"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        if not tulos:
            tilakoodi = 404
            vastaus = {"status": tilakoodi, "teksti": "Ei tuloksia"}
            return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

        vastaus = {
            "status": tilakoodi,
            "id": tulos[0][0],
            "ident": tulos[0][1],
            "type": tulos[0][2],
            "name": tulos[0][3],
            "latitude_deg": tulos[0][4],
            "longitude_deg": tulos[0][5],
            "elevation_ft": tulos[0][6],
            "continent": tulos[0][7],
            "iso_country": tulos[0][8],
            "iso_region": tulos[0][9],
            "municipality": tulos[0][10],
            "scheduled_service": tulos[0][11],
            "gps_code": tulos[0][12],
            "iata_code": tulos[0][13],
            "local_code": tulos[0][14],
            "home_link": tulos[0][15],
            "wikipedia_link": tulos[0][16],
            "keywords": tulos[0][17]
        }
        jsonvast = json.dumps(vastaus)
        return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")

    except Exception as e:
        tilakoodi = 500
        vastaus = {"status": tilakoodi, "error": str(e)}
        return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")


    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/maat')
def maat():
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200
    try:
        sql_kysely = "select * from country"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        columns = [
            "iso_country", "name", "continent", "wikipedia_link", "keywords"
        ]
        data = [dict(zip(columns, row)) for row in tulos]
        vastaus = {
            "status": tilakoodi,
            "countries": data
        }
        jsonvast = json.dumps(vastaus)
        return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")

    except Exception as e:
        tilakoodi = 500
        vastaus = {"status": tilakoodi, "error": str(e)}
        return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/maa/<countrycode>')
def maa(countrycode):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200
    try:
        sql_kysely = f"select * from country where iso_country = '{countrycode}'"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        if not tulos:
            tilakoodi = 404
            vastaus = {"status": tilakoodi, "teksti": "Ei tuloksia"}
            return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

        vastaus = {
            "status": tilakoodi,
            "name": tulos[0][0],
            "continent": tulos[0][1],
            "wikipedia_link": tulos[0][2],
            "keywords": tulos[0][3]
        }
        jsonvast = json.dumps(vastaus)
        return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")

    except Exception as e:
        tilakoodi = 500
        vastaus = {"status": tilakoodi, "error": str(e)}
        return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")


    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/pelaajat')
def pelaajat():
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200
    try:
        sql_kysely = "select * from game"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        columns = [
            "id", "co2_consumed", "co2_budget", "location","screen_name", "money",
            "threat"
        ]
        data = [dict(zip(columns, row)) for row in tulos]
        vastaus = {
            "status": tilakoodi,
            "players": data
        }
        jsonvast = json.dumps(vastaus)
        return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")

    except Exception as e:
        tilakoodi = 500
        vastaus = {"status": tilakoodi, "error": str(e)}
        return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/pelaaja/<nimi>')
def pelaaja(nimi):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200
    try:
        sql_kysely = f"select * from game where id = '{nimi}'"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        if not tulos:
            tilakoodi = 404
            vastaus = {"status": tilakoodi, "teksti": "Ei tuloksia"}
            return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

        vastaus = {
            "status": tilakoodi,
            "id": tulos[0][0],
            "co2_consumed": tulos[0][1],
            "co2_budget": tulos[0][2],
            "location": tulos[0][3],
            "money": tulos[0][5],
            "threat": tulos[0][6]
        }
        jsonvast = json.dumps(vastaus)
        return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")

    except Exception as e:
        tilakoodi = 500
        vastaus = {"status": tilakoodi, "error": str(e)}
        return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/travel_menu/<pelaaja>/<country_code>')
def travel_menu(pelaaja, country_code):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(
            response=json.dumps({"status": 500, "message": "Failed to connect to the database"}),
            status=500,
            mimetype="application/json"
        )

    try:
        # Fetch player data
        sql_kysely = "SELECT * FROM game WHERE id = %s"
        with yhteys.cursor() as kursori:
            kursori.execute(sql_kysely, (pelaaja,))
            tulos = kursori.fetchall()

        if not tulos:
            return Response(
                response=json.dumps({"status": 404, "message": "Player not found"}),
                status=404,
                mimetype="application/json"
            )

        nykysijainti = tulos[0][3]  # Assuming location is in the 4th column

        # Fetch airports in the specified country
        sql_query = "SELECT name, ident FROM airport WHERE iso_country = %s AND type = 'medium_airport'"
        with yhteys.cursor() as cursor:
            cursor.execute(sql_query, (country_code,))
            results = cursor.fetchall()

        if not results:
            return Response(
                response=json.dumps({"status": 404, "message": "No airports found for the specified country"}),
                status=404,
                mimetype="application/json"
            )

        # Prepare the response data
        airports = []
        for row in results:
            name, icao_code = row
            try:
                co2 = calcCO2(nykysijainti, icao_code)
                price = calcPrice(nykysijainti, icao_code)
            except Exception as e:
                print(f"Error calculating metrics for airport {icao_code}: {e}")
                co2, price = "Calculation unavailable", "Calculation unavailable"

            airports.append({
                "name": name,
                "icao_code": icao_code,
                "co2_emissions": co2,
                "price": price
            })

        response_data = {
            "status": 200,
            "country": country_code,
            "airports": airports
        }
        return Response(response=json.dumps(response_data), status=200, mimetype="application/json")

    except Exception as e:
        return Response(
            response=json.dumps({"status": 500, "error": f"Server error: {str(e)}"}),
            status=500,
            mimetype="application/json"
        )

    finally:
        # Ensure the database connection is closed
        if yhteys.is_connected():
            yhteys.close()


@app.route('/suoritustilanne')
def suoritustilanne():
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200
    try:
        sql_kysely = "select * from mission_accomplished"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        columns = [
            "game_id", "mission_id"
        ]
        data = [dict(zip(columns, row)) for row in tulos]
        vastaus = {
            "status": tilakoodi,
            "data": data
        }
        jsonvast = json.dumps(vastaus)
        return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")

    except Exception as e:
        tilakoodi = 500
        vastaus = {"status": tilakoodi, "error": str(e)}
        return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/pelaajantilanne/<nimi>')
def pelaajantilanne(nimi):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200
    try:
        sql_kysely = f"select * from mission_accomplished where game_id = '{nimi}'"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        if not tulos:
            tilakoodi = 404
            vastaus = {"status": tilakoodi, "teksti": "Ei tuloksia"}
            return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

        columns = [
            "game_id", "mission_id"
        ]
        data = [dict(zip(columns, row)) for row in tulos]
        vastaus = {
            "status": tilakoodi,
            "status": data
        }
        jsonvast = json.dumps(vastaus)
        return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")

    except Exception as e:
        tilakoodi = 500
        vastaus = {"status": tilakoodi, "error": str(e)}
        return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/tehtavat')
def tehtavat():
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200
    try:
        sql_kysely = "select * from mission"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        columns = [
            "id", "description", "pay"
        ]
        data = [dict(zip(columns, row)) for row in tulos]
        vastaus = {
            "status": tilakoodi,
            "missions": data
        }
        jsonvast = json.dumps(vastaus)
        return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")

    except Exception as e:
        tilakoodi = 500
        vastaus = {"status": tilakoodi, "error": str(e)}
        return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.route('/tehtava/<nro>')
def tehtava(nro):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    tilakoodi = 200
    try:
        sql_kysely = f"select * from mission where id = '{nro}'"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely)
        tulos = kursori.fetchall()
        if not tulos:
            tilakoodi = 404
            vastaus = {"status": tilakoodi, "teksti": "Ei tuloksia"}
            return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

        vastaus = {
            "status": tilakoodi,
            "id": tulos[0][0],
            "description": tulos[0][1],
            "pay": tulos[0][2]
        }
        jsonvast = json.dumps(vastaus)
        return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")

    except Exception as e:
        tilakoodi = 500
        vastaus = {"status": tilakoodi, "error": str(e)}
        return Response(response=json.dumps(vastaus), status=tilakoodi, mimetype="application/json")

    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()

@app.errorhandler(404)
def page_not_found(virhekoodi):
    vastaus = {
        "status" : "404",
        "teksti" : "Virheellinen päätepiste"
    }
    jsonvast = json.dumps(vastaus)
    return Response(response=jsonvast, status=404, mimetype="application/json")