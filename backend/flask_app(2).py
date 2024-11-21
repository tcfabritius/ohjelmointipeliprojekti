from flask import Flask, Response, request
from dbconf import db
from flask_cors import CORS
import json
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
        raha = tulos[0][4]

        # Calculate price and CO2
        hinta = calcPrice(nyksijainti, kohde)
        co2 = calcCO2(nyksijainti, kohde)
        kysely = """
        UPDATE game
        SET location = %s,
            co2_consumed = co2_consumed + %s,
            money = money - %s
        WHERE id = %s
        """
        kursori.execute(kysely, (kohde, co2, hinta, pelaaja))
        yhteys.commit()
        vastaus = {
            "status": tilakoodi,
            "message": "Travelled to target."
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
            "id", "co2_consumed", "co2_budget", "location", "money",
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
            "money": tulos[0][4],
            "threat": tulos[0][5]
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