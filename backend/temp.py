@app.route('/travel_menu/<country_code>')
def travel_menu(country_code):
    yhteys = db()
    if not yhteys.is_connected():
        return Response(response=json.dumps({"status": 500, "teksti": "Tietokantayhteys epäonnistui"}), status=500, mimetype="application/json")
    try:
        sql_kysely = "SELECT name, ident FROM airport WHERE iso_country = %s"
        kursori = yhteys.cursor()
        kursori.execute(sql_kysely, (country_code,))
        tulos = kursori.fetchall()

        if not tulos:
            return Response(
                response=json.dumps({"status": 404, "teksti": "No airports found for the specified country"}),
                status=404,
                mimetype="application/json"
            )

        data = [{"name": row[0], "icao_code": row[1]} for row in tulos]

        vastaus = {
            "status": 200,
            "country": country_code,
            "airports": data
        }
        return Response(response=json.dumps(vastaus), status=200, mimetype="application/json")

    except Exception as e:
        return Response(
            response=json.dumps({"status": 500, "error": str(e)}),
            status=500,
            mimetype="application/json"
        )

    finally:
        if 'kursori' in locals():
            kursori.close()
        if 'yhteys' in locals() and yhteys.is_connected():
            yhteys.close()
