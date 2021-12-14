# Author Ben Boekema (A00426722) and Srna
# This program reads in 2 text files that
# will later be used to create a json object
# for the scoreboards data

# import json for json implementation and os for checking if file is empty
import json
import os


# Author Srna and Ben Boekema
def readWrite(uploadScore):
    # f is the file that holds all the data for the scoreboard
    f = open("scoreboard.txt", "r")
    # li is the lines being read in from f
    li = f.readlines()
    # close file
    f.close()

    # initialize a list to hold scores known as scores
    scores = []
    # b is a boolean variable to use in a loop later on
    b = False
    # count is variable for iterating through a loop
    count = 0
    # index is length of li
    index = len(li)
    # loop iterates through the lines in li
    for x in li:
        # remove new lines from li
        x = x.strip('\n')
        # continue once their is no new lines
        if x == "":
            continue
        # split the lines in li by : and give the values split fields
        # name is the name of the player and value is the score
        name, value = x.split(":")
        # sorting the list so all values are in highest score at the top and lowest at the bottom
        if(int(value) <= int(uploadScore[1])) and b == False:
            # switch boolean
            b = True
            # make the index the same as count so new value is added to the right place in scores
            index = count
        # add value to the list
        scores.append(f'{name}:{value}\n')
        # count value increase by 1
        count += 1
    # this is a check to make sure no scores are added to the scoreboard that are 0 or less
    if int(uploadScore[1]) > 0:
        scores.insert(index, f'{uploadScore[0]}:{uploadScore[1]}\n')

    # w is the same file as f but has write privileges
    w = open("scoreboard.txt", "w")
    # write new list scores to text file in sorted order
    w.writelines(scores)
    # close files
    w.close()
    # return the list of scores and keep track of count
    return scores, count


def get_json():
    # file to be later opened and used for making json
    filename = 'scoreboard.txt'
    filename2 = '../../public_html/scores.txt'

    # f2 is a file that will act as the placeholder for data that has not been implemented to the scoreboard
    # this file can only be read from
    f1 = open('../../public_html/scores.txt', 'r+')
    # check to see if the file is empty, if empty close file
    if os.stat('../../public_html/scores.txt').st_size == 0:
        f1.close()
    # if file is not empty continue
    else:
        # resultant dictionary
        dict1 = {}

        # fields for the scoreboard
        fields = ['name', 'score']

        # open file to be converted to json
        with open(filename2) as fh:
            # count variable for player id creation
            l = 1
            # for loop to iterate through lines in filename2
            for line in fh:

                # reading line by line from the text file
                description = list(line.strip().split(":", 2))

                readWrite(description)

        with open(filename) as fh:
            # count variable for player id creation
            l = 1
            # for loop to iterate through lines in filename2
            for line in fh:

                # reading line by line from the text file
                description = list(line.strip().split(":", 2))

                # for automatic creation of id for each player
                sno = 'id' + str(l)

                # loop variable
                i = 0
                # intermediate dictionary
                dict2 = {}
                while i < len(fields):
                    # creating dictionary for each player
                    dict2[fields[i]] = description[i]
                    i = i + 1

                # appending the record of each player to
                # the main dictionary
                dict1[sno] = dict2
                l = l + 1
        # return f1 index to the start of the file
        f1.seek(0)
        # delete every line in the text file
        f1.truncate(0)
        # close file
        f1.close()
        # f1w is just another name for f2 except with write privileges
        f1w = open("../../public_html/scores.txt", "w")
        # write a empty statement so the text file always has a line of empty so it doesn't crash the
        # program when run with no new data in scores.txt
        f1w.write("Empty:-1")
        # close files
        f1w.close
        # returns a json object of dict1
        return json.JSONEncoder().encode(dict1)




