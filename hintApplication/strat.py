import csv
import random
import math
import operator

def loadDataset(filename,trainingSet=[]):
	##Sets up a csv file to be able to be processec.
	with open(filename, 'rb') as csvfile:
	    lines = csv.reader(csvfile)
	    dataset = list(lines)
	    for x in range(len(dataset)):
	        for y in range(20):
	            dataset[x][y] = int(dataset[x][y])
	            trainingSet.append(dataset[x])
 
 
def euclideanDistance(instance1, instance2, length):
	#This gets the distance between the input and each of the available pieces of data.
	distance = 0
	for x in range(length):
		distance += pow((int(instance1[x]) - int(instance2[x])), 2)
	return math.sqrt(distance)
 
def getNeighbors(trainingSet, usersInput, k):
	#This iterates through the set of available data and identifies the three closest nieghbours to the input.
	distances = []
	length = len(usersInput)
	for x in trainingSet:
		dist = euclideanDistance(usersInput, x, length)
		distances.append((x, dist))
	distances.sort(key=operator.itemgetter(1))
	neighbors = []
	for x in range(k):
		neighbors.append(distances[x][0])
	return neighbors
 
def getResponse(neighbors):
	#Takes the three closest neighbours and decides using them which category it fits into 
	classVotes = {}
	for x in range(len(neighbors)):
		response = neighbors[x][-1]
		if response in classVotes:
			classVotes[response] += 1
		else:
			classVotes[response] = 1
	sortedVotes = sorted(classVotes.iteritems(), key=operator.itemgetter(1), reverse=True)
	return sortedVotes[0][0]
	
def generatePrediction(trainingSet, usersInput):
	# generate predictions
	k = 3
	neighbors = getNeighbors(trainingSet, usersInput, k)
	result = getResponse(neighbors)
	print('>predicted game type = ' + repr(result))
	(playerStrategy, enemyStrategy) = result.split("-")
	print('>predicted enemy strategy = ' + enemyStrategy)
	print('>predicted player strategy = ' + playerStrategy)


# prepare data
enemyStrategy = ""
playerStrategy = ""
usersInput = []
enemyHistory = []
playerHistory= []
finished = False
trainingSet=[]
turnNumber = 0

loadDataset('data.csv', trainingSet)
print('Train set: ' + repr(len(trainingSet)))

while finished == False:
	turnNumber += 1
	userGo = input("Input your last move - ")
	userInput.append(userGo)
	playerHistory.append(userGo)
	enemyGo = input("Input the opponents last move - ")
	userInput.append(enemyGo)
	playerHistory.append(enemyGo)
