'use strict';

/* Controllers */

load();





function load()
{
    
    CheckUserFeatures();
   
    var OnClient = CheckClient("RoundType");
    var OnClientKeyboard = CheckClient("Keyboard");

    if (OnClient == "No")
    {
        SaveToClient("RoundType", "Baseline");
    }

    if (OnClientKeyboard == "No") {
        SaveToClient("Keyboard", "false");
    }


    else 
    { //Do anything? 
    }
}






function StroopGameCtrl($scope)
{

    $scope.UI = {};
    $scope.game = {};
    $scope.totalProblem = 100;
    $scope.rightScore = 5;//how much score you get when get a correct answer
    $scope.wrongScore = -3;//how much score you get when get a wrong answer
    $scope.totalTime = 60;

    $scope.stopGame = function () {
        $scope.UI.showStartButton = true;
        $scope.UI.showGameButton = false;
        $scope.UI.countDownClass = "badge badge-success";
        $scope.UI.wrongLength = "";//length of green progress bar
        $scope.UI.rightLength = "";//length of red progress bar
        $scope.UI.imgSrc = "Content/img/color.png";

        $scope.game.quizClass = "blue";
        $scope.game.previousColor = "";//to prevent same color multiple times
        $scope.game.answer = "";
        $scope.game.isStarted = false;
        $scope.game.countDown = $scope.totalTime;
    }
    $scope.stopGame();

    $scope.resetGame = function ()
    {
        $scope.setNextProblem();
        $scope.game.previousColor = "";
        $scope.UI.countDownClass = "badge badge-success"
        $scope.UI.imgSrc = "Content/img/none.png";
        $scope.UI.showStartButton = false;
        $scope.UI.showGameButton = true;
        $scope.game.countDown = $scope.totalTime;
        $scope.game.rightCount = 0;
        $scope.game.wrongCount = 0;
        $scope.game.answer = "";
        $scope.game.totalScore = 0;
        $scope.game.isStarted = true;
        $scope.game.Base = ReadFromClient("RoundType");
        $scope.game.Reports = [];
        $scope.game.KeyBoard = ReadFromClient("Keyboard");

    }

    $scope.startGame = function ()
    {
        
        $scope.resetGame();
        var timer = setInterval(function () {
            $scope.$apply(function () {
                $scope.game.countDown--;
                if ($scope.game.countDown < 10) {
                    $scope.UI.countDownClass = "badge badge-important";
                }
                if ($scope.game.countDown == 0) {
                    clearInterval(timer);
                    $scope.stopGame();
                    $scope.game.totalScore = $scope.game.rightCount * $scope.rightScore + $scope.game.wrongCount * $scope.wrongScore;
                    $scope.modalShown = true;
                }
            });
        }, 1000);
    }


    $scope.setNextProblem = function()
    {
        $scope.game.Base = ReadFromClient("RoundType");

        if ($scope.game.Base == null | "" | undefined)
        {
            log("Error in setNextProblem :" + $scope.game.Base);
        }


        if ($scope.game.Base == "Random")
        {
            $scope.setNextRandomProblem();
            return $scope.game.Base;
        }

        if ($scope.game.Base == "Baseline")
        {
            $scope.setNextBaseProblem();
            return $scope.game.Base;
        }
       
    }



    // Returns a random integer between min (included) and max (included)
    // Using Math.round() will give you a non-uniform distribution!
    function getRandomIntInclusive(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    $scope.pickRandomColor = function () {
        var choice = ["green", "red", "blue", "orange"];
        //return choice[Math.floor(Math.random() * 4)];   

        return choice[getRandomIntInclusive(0, 3)];
       
    }


    $scope.setNextBaseProblem = function ()
     {
        $scope.game.quizText = $scope.pickRandomColor();
        $scope.game.quizClass = $scope.game.quizText;

        while ($scope.game.quizText == $scope.game.previousColor)
        {
            $scope.game.quizText = $scope.pickRandomColor();
            $scope.game.quizClass = $scope.game.quizText;
        }

        $scope.game.previousColor = $scope.game.quizText;

     }

    $scope.setNextRandomProblem = function ()
     {

        $scope.game.quizText = $scope.pickRandomColor();
        $scope.game.quizClass = $scope.pickRandomColor();

        while ($scope.game.quizClass == $scope.game.previousColor)
            {
        	    $scope.game.quizClass=$scope.pickRandomColor();
            }
        $scope.game.previousColor=$scope.game.quizClass;
    }


    $scope.clicked = function (input)

    {
        
        if($scope.game.KeyBoard == true)
        {
            alert("You can only use KeyBoard for this Round");
            return
        }


        if ($scope.game.isStarted == false)
        {
            return
        }

        $scope.game.answer = (input == $scope.game.quizClass);
        if ($scope.game.answer == true)
        {
            $scope.game.rightCount++;
            $scope.UI.rightLength = "width:" + $scope.game.rightCount / $scope.totalProblem * 100 + "%";
            $scope.UI.imgSrc = "Content/img/right.png";
         }

        else
        {
            $scope.game.wrongCount++;
            $scope.UI.wrongLength = "width:" + $scope.game.wrongCount / $scope.totalProblem * 100 + "%";
            $scope.UI.imgSrc = "Content/img/wrong.png";
        }

        setTimeout(function () { $scope.UI.imgSrc = "Content/img/none.png"; }, 25);


        $scope.setNextProblem();

        CheckForCheating();
    }


    $scope.typed = function (input)
    {

        if ($scope.game.KeyBoard == false)
        {
            alert("You can only use your Mouse for this Round.");
            return
        }

       

        if ($scope.game.isStarted == false)
        {
            return
        }

        $scope.game.answer = (input == $scope.game.quizClass);
        if ($scope.game.answer == true) {
            $scope.game.rightCount++;
            $scope.UI.rightLength = "width:" + $scope.game.rightCount / $scope.totalProblem * 100 + "%";
            $scope.UI.imgSrc = "Content/img/right.png";
        }

        else {
            $scope.game.wrongCount++;
            $scope.UI.wrongLength = "width:" + $scope.game.wrongCount / $scope.totalProblem * 100 + "%";
            $scope.UI.imgSrc = "Content/img/wrong.png";
        }

        setTimeout(function () { $scope.UI.imgSrc = "Content/img/none.png"; }, 25);

        

        $scope.setNextProblem();

        CheckForCheating();

        
    }




    function CheckForCheating()
    {

        if ($scope.game.wrongCount > 99 || $scope.game.rightCount > 199)  //Does RightCount need to be counted for cheating?
        {

            alert("You are cheating by just pressing or clicking answers!");

            alert("Please try again but don't cheat :) ");

            alert("Restarting Test ...");

            alert("10");
            alert("9");
            alert("8");
            alert("7");
            alert("6");
            alert("5");
            alert("4");
            alert("3");
            alert("2");
            alert("1");
            alert("Ready!");

            $scope.resetGame();
        }


        //Need to check for repeated clicks or keyboard presses.
        //Need to enforce up and down press of key


    }

    function Success()
    {
        UpdateClientStorage("RoundType", "Random");
        UpdateClientStorage("Keyboard", "true");
    }

   

    // Saves Data
    $("#SaveData").click(function ()

    {
       var Report =
            {
                UserName: $scope.game.userName,
                RoundType: $scope.game.Base,
                RightCount:$scope.game.rightCount,
                WrongCount:$scope.game.wrongCount,
                TotalScore:$scope.game.totalScore
            };

       $.ajax({
           type: "POST",
           url: "Data/Create",
           data: Report,
           success: Success(),
           dataType: JSON

           
        });

    }

    
    );


    


} //End of Scope
