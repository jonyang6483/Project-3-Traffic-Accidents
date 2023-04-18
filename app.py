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
@app.route("/api/v1.0/region/<Region>")
def region(Region):
    print("Region")
    
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of passenger data including the name, age, and sex of each passenger"""
    # Query all passengers
    results = session.query(accident.region, accident.veh_num).filter(accident.region==Region).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    crash_region = []
    for region, veh_num in results:
        rcrash_dict = {}
        rcrash_dict["region"] = region
        rcrash_dict["veh_num"] = veh_num
        crash_region.append(rcrash_dict)

    return jsonify(crash_region)
##############


@app.route("/api/v1.0/time/<Time>")
def time(Time):
    print("Time page")
    #return "What time of the day is the most dangerous?"

    # Create our session (link) from Python to the DB
    session = Session(engine)

    time_dict = {
    "Morning": ["6:00am-6:59am","7:00am-7:59am","8:00am-8:59am","9:00am-9:59am","10:00am-10:59am", "11:00am-11:59am"],
    "Afternoon": ["12:00pm-12:59pm", "1:00pm-1:59pm", "2:00pm-2:59pm", "3:00pm-3:59pm", "4:00am-4:59am", "5:00pm-5:59pm" ],
    "Night": ["11:00pm-11:59pm", "12:00am-12:59am","1:00am-1:59am","2:00am-2:59am","3:00am-3:59am","4:00am-4:59am","5:00am-5:59am"]
    }
    
    results = session.query(accident.region,accident.hour).filter(accident.hour.in_(time_dict[Time])).all()

    """Return a list of passenger data including the name, age, and sex of each passenger"""
    # Query all passengers
    #results = session.query(accident.region, accident.hour, accident.veh_num).filter(accident.hour==Time).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    crashes = []
    for region, hour in results:
        crash_dict = {}
        crash_dict["region"] = region
        crash_dict["hour"] = hour
        #crash_dict["veh_num"] = veh_num
        crashes.append(crash_dict)

    return jsonify(crashes)

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