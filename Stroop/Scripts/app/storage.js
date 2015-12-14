
function DocumentExample(key,value)
{
    /// <summary>Determines the area of a circle that has the specified radius parameter.</summary>

    /// <param name="radius" type="Number">The radius of the circle.</param>
    /// <returns type="Number">The area.</returns>
    /// <var> Some variable  </var> 
    var a = b;

    return a;
}


function CheckClient(CheckKey)
{
    /// <summary>Checks to see if Key is already stored on the Client</summary>
    /// <param name="CheckKey" type="String"> The Key to check.</param>
    /// <returns type="String">Exists if it exists, and No if it does not</returns>

    var SavedAlready = IsDataSavedAlreadyClientSide(CheckKey);
    var AlreadyExists = "NotChecked";

    //Already Saved
    if (SavedAlready == "HTML5" || SavedAlready == "Cookie")
    {
        var AlreadyExists = "Exists";
        return AlreadyExists;
    }

    else if (SavedAlready != "HTML5" || SavedAlready != "Cookie" || SavedAlready == null)
    {
        AlreadyExists = "No";
        return AlreadyExists;
    }

}



function CheckUserFeatures()
{
   var Checked = ReadFromClient("checked");

    if (!Checked)
    {
        GetUserFeatures();
        SaveToClient("checked", "true");
    }

    else if (Checked === "true")
    {
        //log("Already checked user features");
    }

    else
    {
        log("Error in checking user features");
    }

}


function SaveToClient(Setkey,Setvalue)
{
  /// <summary>Saves New Data Clientside either in HTML5 or Cookie Storage.</summary>
 //Todo: Need UpdateClient Function

  if (Modernizr.sessionstorage === false & Modernizr.cookies === false)
    {
      log("Client does not support HTML5 or Cookie storage");
      alert("You need to enable your Cookies or upgrade your web broswer, this site needs HTML5 or Cookie Storage.");
      //ToDo: Switch to Server Side Storge, URL Query String add to URL?.
    }

    var SavedAlready = IsDataSavedAlreadyClientSide(Setkey);

    //Already Saved
    if (SavedAlready == "HTML5" || SavedAlready == "Cookie")
    {
        log("The Key: " + Setkey + " Already exists");
        //ToDo: What do do here?  UpdateFunction() to update the value of the key?
        var AlreadyExists = "Exists";
        return AlreadyExists;
     }


    //Only Saves in HTML5 if the key is not already saved.
    if (Modernizr.sessionstorage === true && SavedAlready != "HTML5")
    {
        sessionStorage.setItem(Setkey,Setvalue);
    }

    //Only Saves in Cookie if the key is not already saved.
    else if (Modernizr.sessionstorage === false && Modernizr.cookies === true && SavedAlready != "Cookie")
    {
        log("User does not have HTML5 Storage now Saving to Cookie");
        createCookie(Setkey, Setvalue);
    }

    else 
    {
        log(" Some type of unknown Error in saving");
    }

}

function UpdateClientStorage(key, value)
{
    var Exists = IsDataSavedAlreadyClientSide(key);

    if (Exists == "NotFound")
    {
       
        log("Update to Client Failed for" + key + "because it does not exist!");
        //ToDo: Do anything here?
        return null;
    }


    if(Exists == "HTML5")
        {
           UpdateHTML5(key, value);
        }

    if (Exists == "Cookie")
        {
            UpdateCookie(key, value);
        }

}


function UpdateHTML5(key, value)
{
    sessionStorage.setItem(key, value);
}

function UpdateCookie(key, value)
{
    createCookie(key, value)
}


function ReadFromClient(Findkey)
{
    return sessionStorage.getItem(Findkey);

    //ToDo Add Checking for empties and error handling

    //ToDo add Cookies reading
}


function IsDataSavedAlreadyClientSide(Findkey)
{
    var HTML5Storage = ReadFromClient(Findkey);
    var myCookie = findCookieByName(" + Findkey + ");

    var Found = null;

    //Not Found in HTML5 or Cookie Storage 
    if (HTML5Storage == null & myCookie == null)
    {
        Found = "NotFound";
        return Found;
    }

     else
        {
            if (HTML5Storage != null)
                {
                    Found = "HTML5";
                    return Found;
                }

            if (myCookie != null)
                {
                    Found = "Cookie";
                    return Found;
                }
        
        }
}






function Delete(KeyToDelete)
{
    sessionStorage.removeItem(KeyToDelete);
    log("Deleted Key: " + KeyToDelete);

    //ToDo Delete Cookies
}


function GetUserFeatures()
{
    var True = new Array();
    
    for (var prop in Modernizr)
    {
        if (Modernizr.hasOwnProperty(prop) && Modernizr[prop] === true)
        {
            True[True.length] = prop;
        }
    }

    True.sort();
    log(JSON.stringify(True));

    SaveToClient("UserStorageOptions", JSON.stringify(True));
}






////////////////////////////////   Cookie Functions   ///////////////////////////////////////////////////////////

function createCookie(key,value)
{
    /// <summary>Creates a Cookie given a Name and Value to Store</summary>
    /// <param name="key" type="String">Name of Cookie to Create</param>
    /// <param name="value" type="String">Data to store in the Cookie</param>

    var Storecookie = (key + "=" + value);

    document.cookie = (' " ' + Storecookie + ' "');
    
}





function findCookieByName(name)
{
    ///<summary>Called by ReadCookie(MyCookie) Function, Gets a Cookie by Name </summary>
    ///<returns> Cookie Name or Null</returns>

    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1)
    {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1)
        {
            end = dc.length;
        }
    }
    return unescape(dc.substring(begin + prefix.length, end));
}

function ReadCookie(MyCookie)
{
    ///<summary>Gets a Cookie by Name, and checks if it exists </summary>
    ///<returns> Cookie Value</returns>

    var myCookie = findCookieByName(" + MyCookie + ");

    if (myCookie == null)
    {
        log("The Cookie :" + MyCookie + "Does not exist");
        return null;
    }

    else
    {
        return myCookie;
    }
}




/////////////////////////   Tools    ////////////////////////////////////////////////


function createRandomChars() {
    /// <summary>Creates Random Charters </summary>

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function log(message)
{
    ///<summary>Connects all of the loggers into one location, using only log("Some Message") to log to many loggers at once. </summary>
    
    console.log(message);
    JL().info(message);
}
