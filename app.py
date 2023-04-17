import sqlalchemy
import numpy as np
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

app = Flask(__name__)

#Database total accidents Setup
engine = create_engine("sqlite:///accidents.sqlite")

Base = automap_base()

Base.prepare(autoload_with=engine)

accident = Base.classes.accidents
#################

# Flask Setup
app = Flask(__name__)

# Flask Routes
@app.route("/")
def welcome():
    print("Server received request for 'Home' page...")
    return (
        f"Welcome to the Home Page!<br/>"
        f"<br/>"
        f"Available Routes:<br/>"
        f"<br/>"
        f"/api/v1.0/region<br>"
        f"/api/v1.0/time<br>"
        f"/api/v1.0/make<br>"
        f"/api/v1.0/damage<br>"

    )
    
##############
@app.route("/api/v1.0/region")
def region():
    
    
    session = Session(engine)

  # Query all passengers
    results = session.query(accident.region).all()

    session.close()

    # Convert list of tuples into normal list
    all_accidents = list(np.ravel(results))

    return jsonify(all_accidents)
##############


@app.route("/api/v1.0/time")
def time():
    print("Time page")
    return "What time of the day is the most dangerous?"


@app.route("/api/v1.0/make")
def make():
    print("Make page")
    return "What make has the most accidents?"


@app.route("/api/v1.0/damage")
def damage():
    print("Damage page")
    return "Where are the most severe accidents?"



if __name__ == '__main__':
    app.run(debug=True)