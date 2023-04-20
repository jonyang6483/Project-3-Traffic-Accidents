import sqlalchemy
import numpy as np
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask
from flask_cors import CORS

from flask import Flask, jsonify

app = Flask(__name__)
CORS(app)
#Database total accidents Setup
engine = create_engine("sqlite:///accidents2.sqlite")

Base = automap_base()

Base.prepare(autoload_with=engine)

accident = Base.classes.accidents
#################

# Flask Setup
app = Flask(__name__)
CORS(app)
# Flask Routes
@app.route("/")
def welcome():
    print("Server received request for 'Home' page...")
    return (
        f"Welcome to the Project 3 Home Page!<br/>"
        f"<br/>"
        f"Please use the following routes:<br/>"
        f"<br/>"
        f"/api/v1.0/region/(Region)<br>"
        f"   * Choose one of the 4 Regions and replace '(Region)'<br/>"
        f"          - South<br/>"
        f"          - West<br/>"
        f"          - Mid West<br/>"
        f"          - North East<br/>"
        f"<br/>"
        f"/api/v1.0/time/(Time)<br>"
        f"   * Choose one of the 4 Time of day and replace '(Time)'<br/>"
        f"          - Early Morning<br/>"
        f"          - Morning<br/>"
        f"          - Afternoon<br/>"
        f"          - Night<br/>"
        f"<br/>"
        f"/api/v1.0/make/(Make)<br>"
        f"     * Choose a car Make and replace '(Make)'<br/>"
        f"<br/>"
        f"/api/v1.0/severity/(Region)<br/>"
        f"   * Choose one of the 4 Regions and replace '(Region)'<br/>"
        f"          - South<br/>"
        f"          - West<br/>"
        f"          - Mid West<br/>"
        f"          - North East<br/>"
        f"<br/>"
        f"/api/v1.0/all-accidents<br/>"
        f"*Full Data"
    )
    
##############
@app.route("/api/v1.0/region/<Region>")
def region(Region):
    print("Region")
    
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of passenger data including the name, age, and sex of each passenger"""
    # Query all passengers
    results = session.query(accident.region, accident.passenger_inj, accident.veh_damage, accident.veh_num).filter(accident.region==Region).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    crash_region = []
    for region, inj, damage, veh_num in results:
        rcrash_dict = {}
        rcrash_dict["region"] = region
        rcrash_dict["passenger_inj"] = inj
        rcrash_dict["veh_damage"] = damage
        rcrash_dict["veh_num"] = veh_num
        crash_region.append(rcrash_dict)

    return jsonify(crash_region)
##############


@app.route("/api/v1.0/time/<Region>/<Time>")
def time(Region,Time):
    print("Time page")
    #return "What time of the day is the most dangerous?"

    # Create our session (link) from Python to the DB
    session = Session(engine)

    time_dict = {
    "Morning": ["6:00am-6:59am","7:00am-7:59am","8:00am-8:59am","9:00am-9:59am","10:00am-10:59am", "11:00am-11:59am"],
    "Afternoon": ["12:00pm-12:59pm", "1:00pm-1:59pm", "2:00pm-2:59pm", "3:00pm-3:59pm", "4:00pm-4:59pm", "5:00pm-5:59pm" ],
    "Night": ["6:00pm-6:59pm","7:00pm-7:59pm","8:00pm-8:59pm","9:00pm-9:59pm","10:00pm-10:59pm", "11:00pm-11:59pm"],
    "Early Morning": ["12:00am-12:59am","1:00am-1:59am","2:00am-2:59am","3:00am-3:59am","4:00am-4:59am","5:00am-5:59am"]
    }
    
    if (Region == "All"):
        results = session.query(accident.region,accident.hour).filter(accident.hour.in_(time_dict[Time])).all()
    else: 
        results = session.query(accident.region,accident.hour).filter(accident.hour.in_(time_dict[Time])).filter(accident.region==Region).all()

    """Return a list of passenger data including the name, age, and sex of each passenger"""
   

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    crashes = []
    for region, hour in results:
        crash_dict = {}
        crash_dict["region"] = region
        crash_dict["hour"] = hour
        crashes.append(crash_dict)

    return jsonify(crashes)

@app.route("/api/v1.0/make/<Region>")
def make(Region):
    print("Make")
    
    
    # Create our session (link) from Python to the DB
    session = Session(engine)

    if (Region == "All"):
        results = session.query(accident.make, func.count(accident.case_num)).group_by(accident.make).order_by(func.count(accident.case_num).desc()).all()
    else: 
        results = session.query(accident.make, func.count(accident.case_num)).filter(accident.region==Region).group_by(accident.make).order_by(func.count(accident.case_num).desc()).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    crash_make = []
    for make, acc_count in results:
        mcrash_dict = {}
        mcrash_dict["make"] = make
        mcrash_dict["acc_count"] = acc_count
        crash_make.append(mcrash_dict)

    return jsonify(crash_make)

@app.route("/api/v1.0/severity/<Region>")
def damage(Region):
    print("Severity")
    
# Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of passenger data including the name, age, and sex of each passenger"""
    # Query all passengers
    results = session.query(accident.region, accident.num_injured, accident.veh_damage).filter(accident.region==Region).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    crash_sev = []
    for region, numInj, damage in results:
        mcrash_dict = {}
        mcrash_dict["region"] = region
        mcrash_dict["num_injured"] = numInj
        mcrash_dict["veh_damage"] = damage
        crash_sev.append(mcrash_dict)

    return jsonify(crash_sev)

@app.route("/api/v1.0/all-accidents")
def full_dataset():
    
# Create our session (link) from Python to the DB
    session = Session(engine)

    # Query all passengers
    results = session.query(accident).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    crash_sev = []
    for region, numInj, damage in results:
        mcrash_dict = {}
        mcrash_dict["region"] = region
        mcrash_dict["hour"] = hour
        mcrash_dict["passenger_inj"] = inj
        mcrash_dict["num_injured"] = numInj
        mcrash_dict["veh_damage"] = damage
        crash_sev.append(mcrash_dict)

    return jsonify(crash_sev)

if __name__ == '__main__':
    app.run(debug=True)