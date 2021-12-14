import secrets
import random
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from cryptography.fernet import Fernet
from hydra import compose
import os
from time import time

'''
    Author: Evan Lucas-Currie
    Used for password verification/creation

    Note: I was learning/experimenting while writing this and the code should be looked over
          if you plan on implementing this in a real system if I had more time
          I would clean this up/optimise it
          but since this is really only meant for a single user I was not
          focused on preformance. Flask-login would be better for multiple users.
'''
class Crypt:

    '''
    Init vars
    '''
    def __init__(self):
        self.key = compose(config_name="keys")
        self.key = self.key["keys"]
        self.adminIp = ""
        self.msg = b"\x00" + secrets.token_bytes(16) + b"\x00"
        self.count = 0
        self.currentTime = time()
        self.submitDataUrl = b"\x00" + secrets.token_bytes(16) + b"\x00"

    '''
        Purpose: set generated url
    '''
    def setformUrl(self,url):
        self.submitDataUrl = url
    
    '''
        Purpose: set admin information
    '''
    def setAdminIp(self, adminIp, url):
        self.adminIp = self.__generate(bytes(adminIp + url, 'utf-8')).derive(self.msg)
    
    '''
        Purpose: get generated url
    '''
    def getformUrl(self):
        temp = self.submitDataUrl
        self.submitDataUrl = b"\x00" + secrets.token_bytes(16) + b"\x00"
        return temp
    
    '''
        Purpose: checks if request was made by the person who signed in
        return: boolean
    '''
    def checkAdmin(self, adminIp, url):
        if self.__generate(bytes(adminIp + url, 'utf-8')).derive(self.msg) == self.adminIp:
            self.msg = b"\x00" + secrets.token_bytes(16) + b"\x00"
            return True
        self.msg = b"\x00" + secrets.token_bytes(16) + b"\x00"
        return False

    '''
        Purpose: Create/reset password
        return: string false or true
    '''
    def newPassword(self, username, password, secret):
        self.count += 1

        if not self.__checkCount():
            return "false"
        user = username    
        username, password = self.__filler(username, password)        

        if os.path.isfile(self.key[1]):
            fkey = self.__readFromFile(self.key[1])
            fkey = Fernet(fkey)
        else:
            fkey = Fernet.generate_key()
            self.__writeToFile(self.key[1], fkey)
            fkey = Fernet(fkey)
        
        if os.path.isfile(self.key[0]):
            actualKey = self.__readFromFile(self.key[0])
            __, newKey = self.__scrypt(user, secret)
        else:
            __, key = self.__scrypt(user, secret)
            token = fkey.encrypt(key)
            self.__writeToFile(self.key[0], token)     
            actualKey = token
            newKey = fkey.decrypt(actualKey)

        actualKey = fkey.decrypt(actualKey)

        if newKey != actualKey:
            return "false"
        
        password, key = self.__scrypt(username, password, actualKey)

        if (os.path.isfile(self.key[2])):
            os.remove(self.key[2])
        
        self.__writeToFile(self.key[2], key)

        return self.__checkPassword(password, actualKey, key)
    
    '''
        Purpose: Verify the password given
        returns: boolean
    '''
    def verifyPassword(self, username, password):
        self.count += 1
        
        if not self.__checkCount():
            return False

        username, password = self.__filler(username, password)
        
        try:
            actualKey = self.__readFromFile(self.key[0])
            fkey = self.__readFromFile(self.key[1])
            fkey = Fernet(fkey)
            actualKey = fkey.decrypt(actualKey)
            password, key = self.__scrypt(username, password, actualKey)
            file = open(self.key[2], 'rb')
            actualKey = self.__readFromFile(self.key[2])

            if key == actualKey:
                return True

        except:
            print("Error most likely opening files")
            return False  
        return False
        
    
    '''
        Purpose: Writes to file in bytes
        return: firstline of file
    '''
    def __writeToFile(self,fileName, write):
        file = open(fileName, "wb")
        file.write(write)
        file.close()

    '''
        Purpose: Read file in bytes
        return: firstline of file
    '''
    def __readFromFile(self, fileName):
        file = open(fileName, "rb")
        temp = file.readlines()
        file.close()
        return temp[0]

    '''
        Purpose: check the password
        returns: string true or false
    '''
    def __checkPassword(self, password, actualKey, key):
        try:
            kdf = self.__generate(actualKey)
            kdf.verify(password, key)
            return "true"
        except:
            print("Do not match")
            return "false"

    '''
        Purpose: used to generate key
        returns: salt and key
    '''
    def __scrypt(self, username, password, key=0):
        salt = ''.join(x+y for x,y in zip(*(s+s[-1]*(max(len(username),len(password))-len(s)) for s in (username,password))))
        salt = bytes(salt, 'utf-8') 
        
        # derive
        if key != 0:
            kdf = self.__generate(key)
        else:
            kdf = self.__generate(salt)
        key = kdf.derive(salt)

        return (salt, key)

    '''
        Purpose: Used To create filler for zip
        Returns: filled strings
    '''
    def __filler(self, username, password):
        if len(username) < len(password):
            username = username.ljust(len(password), "*") 
        elif len(password) < len(username):
            password = password.ljust(len(username), "*")
        return (username, password)

    '''
        Purpose: Creates Script obj to generate keys

        return: Scyrpt obj
    '''
    def __generate(self, salt):
        kdf = Scrypt(salt=salt, length=32, n=2**14,r=8,p=1)
        return kdf

    '''
        Purpose: Slow brute force attempts, 
	         it is possible for other users to deny access to admin by constantly trying to log in
        return false
    '''
    def __checkCount(self):
        timePassed = time() - self.currentTime
        if(timePassed <= 60):
            if(self.count >= 10):
                return False
            return True
        else:
            self.count = 0
            self.currentTime = time()
            return True
