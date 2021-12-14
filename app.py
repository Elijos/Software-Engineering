import json
from flask import Flask, render_template, jsonify, url_for, redirect
from flask_cors import CORS
import random
import argparse
import io
from numpy import apply_over_axes
import torch
from PIL import Image
from flask import request
from hydra import compose, initialize
from Crypt import Crypt
import uuid
from os import walk
import scoreboard

#Init and get config data
initialize(config_path="config", job_name="app")
appConfig = compose(config_name="app")

#Start up app
app = Flask(__name__)
CORS(app)

####################################
'''
    Server routes for html requests
'''
#####################################
@app.route(appConfig.routes.html.objectDectection)
def objDetection():
    return render_template(appConfig.htmlFile.objectDetection)

@app.route(appConfig.routes.html.index)
def index():
    return render_template(appConfig.htmlFile.homeScreen)

@app.route(appConfig.routes.html.guessWhat)
def guessWhat():
    return render_template(appConfig.htmlFile.guessWhat)

@app.route(appConfig.routes.html.aboutUs)
def aboutUs():
    return render_template(appConfig.htmlFile.aboutUs)

@app.route(appConfig.routes.admin.adminLogin)
def admin():
    return render_template(appConfig.htmlFile.admin)

################################
'''
    Post Requests
'''
################################

@app.route(appConfig.routes.admin.reset, methods=["POST"])
def adminReset():
    if request.method != "POST":
        return

    username = request.form["username"]
    password = request.form["password"]

    secret = request.form["secret"]
    username = username.lower()
    result = crypt.newPassword(username=username, password=password,secret=secret)
    return '{"result":%s}' % result

@app.route(appConfig.routes.admin.login, methods=["POST"])
def adminLogin():

    if request.method != "POST":
        return

    username = request.form["username"]
    password = request.form["password"]
    username = username.lower()
    result = crypt.verifyPassword(username=username, password=password)

    if result:
        #generates a one time use url
        url = uuid.uuid4().hex
        crypt.setAdminIp(request.remote_addr, url)
        return '{"result":true, "url":"%s"}' % url
    else:
        return '{"result":false}'

@app.route(appConfig.routes.admin.ID)
def adminLoggedIn(id):
    
    if crypt.checkAdmin(request.remote_addr, id):
        global audioFiles
        url = uuid.uuid4().hex
        crypt.setformUrl(url)
        filenames = next(walk(appConfig.audioFileLocation), (None, None, []))[2] 
        audioFiles = filenames
        
        return render_template(appConfig.htmlFile.adminLoggedIn, audioFiles=filenames, submitDataUrl=url)

    return

@app.route(appConfig.routes.admin.submit, methods=["POST"])
def submitAudio(id):

    if request.method != "POST":
        return

    if id == crypt.getformUrl():
        try:
            global audioFiles
            dicts = request.files.to_dict()
            for x in dicts:
                if x.endswith(".mp3"):
                    if dicts[x].content_type == "audio/mpeg":
                        if x in audioFiles:
                            dicts[x].save(("%s/%s" % (appConfig.audioFileLocation, x)))
                url = uuid.uuid4().hex
                crypt.setformUrl(url)
            return {"newID":f"{url}"}
        except Exception as e:
            print("nodata", e)
        
        return "true"
    return "false"


@app.route(appConfig.routes.predictions.objectPrediction, methods=["POST"])
def predict():

    if request.method != "POST":
        return
    
    if 'image' not in request.files:
        resp = jsonify({'message' : 'No image recieved'})
        resp.status_code = 400
        return resp
    try:
        if request.files.get("image"):
            image_file = request.files["image"]
            image_bytes = image_file.read()
            img = Image.open(io.BytesIO(image_bytes))
            results = model(img, size=appConfig.model.inferenceSize)
            return results.pandas().xyxy[0].to_json(orient="records", force_ascii = True)
    except:
        return

###############################
'''
    Get Requests
'''
###############################

@app.route(appConfig.routes.tensorflow.model, methods=['GET'])
def getModel():
    return redirect(url_for(appConfig.staticFileLocation,filename=appConfig.tensorflow.model))

@app.route(appConfig.routes.tensorflow.metaData, methods=['GET'])
def getMetaData():
    return redirect(url_for(appConfig.staticFileLocation,filename=appConfig.tensorflow.metaData))

@app.route(appConfig.routes.tensorflow.shard1, methods=['GET'])
def getShard1():
    return redirect(url_for(appConfig.staticFileLocation,filename=appConfig.tensorflow.shard1))

@app.route(appConfig.routes.tensorflow.shard2, methods=['GET'])
def getShard2():
    return redirect(url_for(appConfig.staticFileLocation,filename=appConfig.tensorflow.shard2))

@app.route(appConfig.routes.styles[0], methods=['GET'])
def getstyle():
    return redirect(url_for(appConfig.staticFileLocation,filename=appConfig.guessWhat[0]))

@app.route(appConfig.routes.styles[1], methods=['GET'])
def getjs():
    return redirect(url_for(appConfig.staticFileLocation,filename=appConfig.guessWhat[1]))

@app.route(appConfig.routes.particles.mainScreen)
def particlesMainScreen():
    return redirect(url_for(appConfig.staticFileLocation,filename=appConfig.particles[0]))

@app.route(appConfig.routes.particles.objectDetection)
def particlesObject():
    return redirect(url_for(appConfig.staticFileLocation,filename=appConfig.particles[1]))

@app.route(appConfig.routes.particles.aboutPage)
def particlesAbout():
    return redirect(url_for(appConfig.staticFileLocation,filename=appConfig.particles[2]))

@app.route(appConfig.routes.image.neoncat)
def neonCat():
    return redirect(url_for(appConfig.staticFileLocation, filename=appConfig.images.neonCat))

@app.route(appConfig.routes.image.aboutImg)
def aboutImg():
    return redirect(url_for(appConfig.staticFileLocation, filename=appConfig.images.aboutImg))

@app.route(appConfig.routes.scoreboard["get"], methods=["POST"])
def scoreBoard():
    if request.method != "POST":
        return
    return scoreboard.get_json()

@app.route(appConfig.routes.scoreboard["html"])
def getScore():
    return render_template(appConfig.htmlFile.scoreboard)

@app.route(appConfig.routes.scoreboard["submit"], methods=["POST"])
def submitScore():
    print(request.form["name"], request.form["score"])
    scoreboard.readWrite([request.form["name"], int(request.form["score"])])
    return "false"

if __name__ == "__main__":
    crypt = Crypt()
    parser = argparse.ArgumentParser(description="Flask backend")
    parser.add_argument("--ip", default=appConfig.host.ip, help="Host ip, use: 0.0.0.0 for local host")
    parser.add_argument("--port", default=appConfig.host.port, type=int, help="port number")
    args = parser.parse_args()
    model = torch.hub.load(appConfig.model.dir, appConfig.model.modelType, source="local", force_reload=False, 
                            path=appConfig.model.modelLocation, device=appConfig.model.device)
    app.run(host=args.ip, port=args.port)
