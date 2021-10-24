from db import db
# from routes import exercise
import users

def add_result(exercise_id, used_time, adjusted_time, errors):
    user_id = users.user_id()
    if user_id == 0:
        return False
    sql = "INSERT INTO results (user_id, exercise_id, used_time, adjusted_time, errors, sent_at) VALUES (:user_id, :exercise_id, :used_time, :adjusted_time, :errors, NOW()) RETURNING id"
    db.session.execute(sql, {"user_id":user_id, "exercise_id":exercise_id, "used_time":used_time, "adjusted_time": adjusted_time, "errors": errors})
    db.session.commit()
    return True

def secondsToTime(seconds):
  seconds=int(seconds)
  minutes=0
  hours=0
  if (seconds>=60):
    minutes=(seconds//60)
    seconds-=minutes*60
    if (minutes>=60):
      hours=(minutes//60)
      minutes-=hours*60
    
  if (seconds < 10 or seconds == 0):
    seconds = '0' + str(seconds)

  if (minutes < 10 or minutes == 0):
    minutes = '0' + str(minutes)

  if (hours < 10 or hours == 0):
    hours = '0' + str(hours)

  result = str(hours) + ':' + str(minutes) + ':' + str(seconds)

  return result

def get_personal_top10(exercise):
    user = users.user_id()
    sql = "SELECT users.username, results.adjusted_time, results.sent_at, results.errors FROM results LEFT JOIN users ON users.id=results.user_id WHERE user_id=:user_id AND exercise_id=:exercise_id ORDER BY adjusted_time LIMIT 5"
    result = db.session.execute(sql, {"user_id": user, "exercise_id": exercise})
    data=result.fetchall()
    newData=[]
    for i, item in enumerate (data):
        newData.append({})
        newData[i]["adjusted_time"]=secondsToTime(item["adjusted_time"])
        newData[i]["sent_at"]=item["sent_at"]
        newData[i]["username"]=item["username"]
        newData[i]["errors"]=item["errors"]
    return newData

def get_top10(exercise):
    # sql = "SELECT adjusted_time, sent_at FROM results WHERE exercise_id=:exercise_id ORDER BY adjusted_time LIMIT 10"
    sql= "SELECT users.username, results.adjusted_time, results.sent_at, results.errors FROM results LEFT JOIN users ON users.id=results.user_id WHERE exercise_id=:exercise_id ORDER BY adjusted_time LIMIT 5"
    result = db.session.execute(sql, {"exercise_id": exercise})
    data=result.fetchall()
    newData=[]
    for i, item in enumerate (data):
        newData.append({})
        newData[i]["adjusted_time"]=secondsToTime(item["adjusted_time"])
        newData[i]["sent_at"]=item["sent_at"]
        newData[i]["username"]=item["username"]
        newData[i]["errors"]=item["errors"]
    return newData

def get_latest_results_by_exercise(exercise):
    user = users.user_id()
    sql = "SELECT users.username, results.adjusted_time, results.sent_at, results.errors FROM results LEFT JOIN users ON users.id=results.user_id WHERE user_id=:user_id AND exercise_id=:exercise_id ORDER BY sent_at DESC LIMIT 100"
    result = db.session.execute(sql, {"user_id": user, "exercise_id": exercise})
    data=result.fetchall()
    newData=[]
    for i, item in enumerate (data):
        newData.append({})
        newData[i]["adjusted_time"]=secondsToTime(item["adjusted_time"])
        newData[i]["sent_at"]=item["sent_at"]
        newData[i]["username"]=item["username"]
        newData[i]["errors"]=item["errors"]
    return newData

MAX_ERROR_RATE = 0.05
MIN_TYPING_RATE = 2 #letters per second  

def is_approved(exercise):
    user = users.user_id()
    sql = "SELECT results.adjusted_time, results.used_time, results.sent_at, results.errors, exercises.text_to_write FROM results LEFT JOIN exercises ON exercises.id=results.exercise_id WHERE user_id=:user_id AND exercise_id=:exercise_id ORDER BY adjusted_time LIMIT 1"
    result = db.session.execute(sql, {"user_id": user, "exercise_id": exercise})
    data=result.fetchone()
    if data==None:
        return False
    newData={}
    newData["adjusted_time"]=data["adjusted_time"]
    newData["used_time"]=data["used_time"]
    newData["sent_at"]=data["sent_at"]
    newData["errors"]=data["errors"]
    newData["text_to_write"]=data["text_to_write"]
    
    text_length=len(newData["text_to_write"])
    time=int(newData["used_time"])
    errors=int(newData["errors"])
    typing_rate=text_length/time
    error_rate=errors/text_length
    if typing_rate>MIN_TYPING_RATE and error_rate<MAX_ERROR_RATE:
        return True
    return False