window.onload = function(){
    // ************************** global variables **************************
    
    var StageNumber = 0;        // if equals zero(0), it wont start in this way
    // var StageNumber = 0.5;
    
    
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var colorLeft = getRandomColor();
    var colorRight = getRandomColor();
    var ammo = 500;
    var health = 100;
    // var health = 0;
    var shield = 100;
    var baseX = -15;
    var baseY = 10;
    var timeFinito = 1500;
    var playerPosX = 0;
    var playerPosY = 0;
    var timeout;
    var radarCounter = 0;
    var time = 0;
    
    
    var rendered = false;
    
    
    var totalScore = 0;
    

    var rotation = 0;
    var rotationSpeed = 0.001;
    var width = 100;
    var height = 50;

    var game = {
    update: function(dt) {
        rotation += rotationSpeed*dt;
        if(rotation >= 3.1) {
            rotation = 0;
            }
        },
    draw: function() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.save();
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(rotation);
        ctx.fillStyle = '#ad3939';
        ctx.fillRect(0-width/2,0-height/2,width,height);
        ctx.restore();
        }
    }
    // ************************** global variables **************************

    
    // ************************************************************************************************************************************
    // **************************************************** game about(copied for now) ****************************************************
    // ************************************************************************************************************************************
   
    
    var myGamePiece;
    
    function startGame() {
        myGameArea.start();
        myGamePiece = new component(40, 40, "red", 532, 420);
    }
    
    
    var myGameArea = {
        start : function() {
            this.canvas = canvas;
            this.ctx = ctx;
            
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            // this.interval = setInterval(updateGameArea, 20);
            this.interval = setInterval(updateGameArea, 16);
            
            window.addEventListener('keydown', function (e) {
                myGameArea.keys = (myGameArea.keys || []);
                myGameArea.keys[e.keyCode] = (e.type == "keydown");
            })
            
            window.addEventListener('keyup', function (e) {
                myGameArea.keys = (myGameArea.keys || []);
                myGameArea.keys[e.keyCode] = (e.type == "keydown");            
            })
            
        }, 
        clear : function(){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    function component(width, height, color, x, y) {
        this.gamearea = myGameArea;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.stepFlag = 0;
        this.stepCounter = 0;
        this.directionFlag = true;
        this.update = function(direction, stage) {
            // add some more elements
            
            
            // draw some kind of background here
            // after all try to include this stuff into main-loop
            
            
            // put counter outside if-else-statements
            this.stepCounter++;
            this.stepCounter++;
            if (this.stepCounter > 200) {
                this.stepCounter = 0;
                this.directionFlag = !this.directionFlag;
                
            }
            
            this.stepFlag++;                                // cause moving animation lookslike more natural
            if (this.stepFlag > 19) {
                this.stepFlag = 0;
            }
            
            if (stage == "stage_01") {
                ctx.fillStyle = "green";
                ctx.fillRect(60, 480, 1030, 480);
                draw_scene(stage);                     // it is quite important
                
                image = choose_player_image(direction, this.stepFlag)           // current player image
                 // add some flying positions :)
                
                // check health
                if (health < 1) {
                    console.log("you are dead!");
                    image = choose_player_image('dead', this.stepFlag)
                } else {
                    totalScore++;
                }
                
                // try to resize(downsize) yourself when backward and enlarge when close to you
                // ctx.drawImage(image, this.x, this.y, 100, 100);
                ctx.drawImage(image, this.x, this.y, 50 + 50*(this.y/600), 50 + 50*(this.y/600));
                ctx.stroke();
                
                
                
                // random laser
                if (this.directionFlag) {
                    lasers_strike(485 + 2*(this.stepCounter), 500 + 2*(this.stepCounter), this.stepFlag);
                    lasers_strike(120 + 3.3*(this.stepCounter), 950 - 20*Math.sqrt(this.stepCounter), this.stepFlag);
                    
                } else {
                    lasers_strike(485 + 400 - 2*(this.stepCounter), 500 + 400 - 2*(this.stepCounter), this.stepFlag);
                    lasers_strike(120 + 660 - 3.3*(this.stepCounter), 950 - 282 + 20*Math.sqrt(this.stepCounter), this.stepFlag);
                }
                
                
                // static
                lasers_strike(500, 600, this.stepFlag);
                lasers_strike(650, 850, this.stepFlag);
            }
            
            
            
            else if (stage == "stage_02") {
                // draw scene
                ctx.fillStyle = "#001043";
                ctx.fillRect(60, 180, 1030, 800);
                draw_scene(stage);                     // it is quite important
                
                

                
                
                
                
                // player
                if (direction == "stand") {
                    direction = "stand_up";
                }
                image = choose_player_image(direction, this.stepFlag)           // current player image
                ctx.drawImage(image, this.x, this.y, 50 + 50*(this.y/600), 50 + 50*(this.y/600));
                ctx.stroke();
                
            }
            
            else {
                // something else
                
            }
            
            // this is really ugly, but its the only way i can do it for now :(
        }
        
        
        this.newPos = function(stage) {
            // try to limit player moves at this level
            if (stage == "stage_01") {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // left side
                if (this.x < 387 - (-465 + this.y)/1.18) {
                    this.x = 387 - (-465 + this.y)/1.18; 
                }
                
                // right side
                if (this.x > 697 + (-500 + this.y)/1.18) {
                    this.x = 697 + (-500 + this.y)/1.18; 
                }

                // top
                if (this.y < 420) {
                    this.y = 420;
                }
                
                // bottom
                if (this.y > 840) {
                    this.y = 840;
                }
                
                
                playerPosX = this.x;
                playerPosY = this.y;
                
            } else if (stage == "stage_02") {
                this.x += this.speedX;
                playerPosX = this.x;
                this.y += this.speedY;
                
                // stars up
                if (this.y < 705) {
                    this.y = 705;
                }
                if (this.y > 840) {
                    this.y = 840;
                }
                
                
                playerPosY = this.y;
            } else {
                this.x += this.speedX;
                playerPosX = this.x;
                this.y += this.speedY;
                playerPosY = this.y;
            }
        }    
    }
    
    function updateGameArea() {
        // this.speed = 5;
        this.speed = 5;
        this.lastKey = '';
        myGameArea.clear();
        myGamePiece.speedX = 0;
        myGamePiece.speedY = 0;
        if (myGameArea.keys && myGameArea.keys[37]) {
            myGamePiece.speedX = -(this.speed);
            this.lastKey = 'left';
            }
            
        if (myGameArea.keys && myGameArea.keys[39]) {
            myGamePiece.speedX = (this.speed);
            this.lastKey = 'right';
            }
            
        if (myGameArea.keys && myGameArea.keys[38]) {
            myGamePiece.speedY = -(this.speed);
            this.lastKey = 'up';
            }
            
        if (myGameArea.keys && myGameArea.keys[40]) {
            myGamePiece.speedY = (this.speed);
            this.lastKey = 'down';
            }
            
        if (this.lastKey == '') {
            this.lastKey = 'stand';
        }
            
        myGamePiece.newPos("stage_01");
        myGamePiece.update(this.lastKey, "stage_01");
        
        // myGamePiece.newPos("stage_02");   
        // myGamePiece.update(this.lastKey, "stage_02");
        
        
    }
    
    function choose_player_image(direction, stepFlag) {
        var image = new Image();
        if (direction == 'stand') {
            // stand still :)
            image.src = "images/strange_down.png";
        } else if (direction == 'stand_up') {
            // whoa :)
            image.src = "images/strange_up.png"
            
        } else if (direction == 'dead') {
            image.src = "images/strange_dead.png"
            
        } else if (direction == 'up') {
            if (stepFlag > 10) {
                image.src = "images/strange_up_move_left.png";
            } else {
                image.src = "images/strange_up_move_right.png";
            }
            
        } else if (direction == 'down') {
            if (stepFlag > 10) {
                image.src = "images/strange_down_move_left.png";
            } else {
                image.src = "images/strange_down_move_right.png";
            }
            
        } else if (direction == 'left') {
            if (stepFlag > 10) {
                image.src = "images/strange_left_move_left.png";
            } else {
                image.src = "images/strange_left_move_right.png";
            }
            
        } else if (direction == 'right') {
            if (stepFlag > 10) {
                image.src = "images/strange_right_move_left.png";
            } else {
                image.src = "images/strange_right_move_right.png";
            }
            
        } else if (direction == 'up_left') {
            image.src = "images/strange_down.png";
            
        } else if (direction == 'up_right') {
            // the same as left but mirrored
            image.src = "images/strange_down.png";
            
        } else if (direction == 'down_left') {
            image.src = "images/strange_down.png";
            
        } else if (direction == 'down_right') {
            // the same as left but mirrored
            image.src = "images/strange_down.png";
            
        } else {
            image.src = "images/strange_down.png";
        }
        
        return image
    }
    
    
    
    
    // ************************************************************************************************************************************
    // **************************************************** game about(copied for now) ****************************************************
    // ************************************************************************************************************************************    
    
    // startGame();        // this creates object to be moved
    
    document.addEventListener("click", function() {
        ammo -= 5;
        // health -= 1;
        
        var colorLeft = getRandomColor();
        var colorRight = getRandomColor();
    });
    
    
    
    var keyDownPressed = false;
    var keyUpPressed = false;
    var keyLeftPressed = false;
    var keyRightPressed = false;
    
    
    document.addEventListener("keydown", function(event) {
        if (event.keyCode == 37){
            // console.log("arrow left!");
            keyLeftPressed = true;
            
        } else if (event.keyCode == 38){
            // console.log("arrow up!");
            keyUpPressed = true;
            
        } else if (event.keyCode == 39){
            // console.log("arrow right!");
            keyRightPressed = true;
            
        } else if (event.keyCode == 40){
            keyDownPressed = true;
        }
    });
    
    document.addEventListener("keyup", function(event) {
        if (event.keyCode == 37){
            // console.log("arrow left!");
            keyLeftPressed = false;
            
        } else if (event.keyCode == 38){
            // console.log("arrow up!");
            keyUpPressed = false;
            
        } else if (event.keyCode == 39){
            // console.log("arrow right!");
            keyRightPressed = false;
            
        } else if (event.keyCode == 40){
            // console.log("arrow down!");
            keyDownPressed = false;
        }
    });
    
    function draw_background() {
      var imageObj = new Image();
      imageObj.src = "images/gwgc201819_overlay.png";
      ctx.drawImage(imageObj, 0, 0, 1919, 1079);
    }
    
    function draw_radar(angle, xPos, yPos) {
        // angle or radar ray; 0 -> turned right (90deg range)
        // remember of degrees and radias usage -> 360deg <-> 2*PI
        draw_rect('black', baseX + 1170, baseY + 80, 340, 320);
        
        var centerX = baseX + 1340;
        var centerY = baseY + 240;
        var radius = 150;
        
        var grd = ctx.createRadialGradient(centerX, centerY, radius/1.5, centerX, centerY, radius);
        grd.addColorStop(1, "#105310");
        grd.addColorStop(0, "black");
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'green';
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius/1.5, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'green';
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius/3, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'green';
        ctx.stroke();
        
        
        // ray start-stop
        var startRay = (angle/360)*(Math.PI*2);
        var stopRay = (angle/360)*(Math.PI*2) + Math.PI/2;
        
        
        // check if enemies are in radar range
        var inAngle = false;
        if (xPos != 0) {
            // this should be the best idea, to divide circle into two parts
            if (xPos > 0) {
                var objectAngle = (Math.PI*2 - Math.atan(-yPos/(xPos))) % (Math.PI*2); 
            } else {
                var objectAngle = (Math.PI*1 - Math.atan(-yPos/(xPos))) % (Math.PI*2);
            }
            
            // https://stackoverflow.com/questions/12234574/calculating-if-an-angle-is-between-two-angles
            var angleDiff = (objectAngle - (startRay + Math.PI/4) + Math.PI*3) % (Math.PI*2) - Math.PI;
            if ((angleDiff >= -Math.PI/4) && (angleDiff <= Math.PI/4)) {
                inAngle = true;     // object in radar angle
            }
        }
        
        var distance = (Math.pow(xPos, 2) + Math.pow(yPos, 2));
        var inRange = Boolean(distance <= 9*Math.pow(radius, 2));
        if (inRange && inAngle) {
            // draw red dot
            pointRadius = 8 - 0.000025*distance;
            // console.log(pointRadius);       // optional
            
            ctx.beginPath();
            ctx.arc(centerX + xPos/3, centerY + yPos/3, pointRadius, 0, Math.PI*2, false);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
        
        // draw ray with transparency
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startRay, stopRay, false);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = "rgba(105, 225, 105, 0.4)";
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        return true;
    }
    
    
    function draw_terminal(text) {
        // just draw python window with changing text
        // use gradient as windows topbar & python ico to be funny
        // some easter egg
        // there is much enough space in top-right corner :)

        var firstItemX = 1530;
        var firstItemY = 80;
        
        
        
        // black filled_rect
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(baseX + firstItemX, baseY + firstItemY, 325, 440);
        ctx.stroke();
        
        // blue-white gradient on the top
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(baseX + firstItemX, baseY + firstItemY, 325, 440);
        ctx.stroke();
        
        
        var grd = ctx.createLinearGradient(1550, 0, 1950, 0);
        grd.addColorStop(0, "#001063");
        grd.addColorStop(1, "#B0B0F3");
        ctx.fillStyle = grd;
        ctx.fillRect(baseX + firstItemX, baseY + firstItemY, 325, 25);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'silver';
        ctx.rect(baseX + firstItemX, baseY + firstItemY, 325, 25);
        ctx.stroke();
        

        //silver around
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "silver";
        ctx.rect(baseX + firstItemX, baseY + firstItemY, 325, 440);
        ctx.stroke();
        
        
        // text on it
        ctx.font = "small-caps bold 55px Courier";
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);     // Create gradient
        gradient.addColorStop("0", "black");
        gradient.addColorStop("0.1", "blue");
        gradient.addColorStop("1.0", "black");
        // ctx.fillStyle = gradient;                                           // Fill with gradient
        ctx.fillStyle = "white";                                           // Fill with gradient
        ctx.fillText(text, baseX + 1540, baseY + 187);
        
        

        
        return true
    }
    
    
    
    function draw_image(weapon) {
        var imageObj = new Image();
        
        if (weapon == 'knife') {
            imageObj.src = "images/knife.png";
            ctx.drawImage(imageObj, baseX + 1375, baseY + 405, 300, 130);
            
        } else if (weapon == 'AK47') {
            imageObj.src = "images/AK47.png";
            ctx.drawImage(imageObj, baseX + 1375, baseY + 405, 300, 130);
          
        } else if (weapon == 'gun') {
            imageObj.src = "images/gun.png";
            ctx.drawImage(imageObj, baseX + 1375, baseY + 405, 300, 130);
          
        } else if (weapon == 'radar') {
            imageObj.src = "images/radar.png";
            ctx.drawImage(imageObj, baseX + 1170, baseY + 90, 296, 300);
            
        } else if (weapon == 'shell') {
            imageObj.src = "images/shell.png";
            ctx.drawImage(imageObj, baseX + 1550, baseY + 80, 296, 320);
        }
    }
    
    function draw_scene(type) {
        // use it for drawing background for every round
        
        if (type == 'stage_01') {
            
            ctx.beginPath();
            ctx.lineWidth = "7";
            ctx.strokeStyle = "black";
            ctx.rect(447, 185, 250, 300);
            ctx.stroke();
            
            
            // use this as example
            ctx.beginPath();
            ctx.moveTo(60, 950);
            ctx.lineTo(447, 485);
            ctx.moveTo(1084, 950);
            ctx.lineTo(697, 485);
            
            ctx.lineWidth = "5";
            ctx.strokeStyle = 'black';
            ctx.stroke();            
            
            
            
            if (true) {
                // draw & fill left wall
                var grd = ctx.createLinearGradient(20, -0, 430, -20);
                grd.addColorStop(1, "#105310");
                grd.addColorStop(0, "black");
                
                ctx.beginPath();
                ctx.moveTo(60, 180);
                ctx.lineTo(447, 180);
                ctx.lineTo(447, 485);
                ctx.lineTo(60, 950);
                ctx.lineTo(60, 180);

                ctx.fillStyle = grd;
                ctx.fill();
                ctx.lineWidth = "5";
                ctx.strokeStyle = 'black';
                ctx.stroke();
            }
            
            if (true) {
                // draw & fill right wall
                // var grd = ctx.createLinearGradient(20, -0, 330, -20);
                var grd = ctx.createLinearGradient(1120, -220, 650, -220);
                grd.addColorStop(1, "#105310");
                grd.addColorStop(0, "black");
                
                ctx.beginPath();
                ctx.moveTo(1084, 180);
                ctx.lineTo(697, 180);
                ctx.lineTo(697, 485);
                ctx.lineTo(1084, 950);
                ctx.lineTo(1084, 180);

                ctx.fillStyle = grd;
                ctx.fill();
                ctx.lineWidth = "5";
                ctx.strokeStyle = 'black';
                ctx.stroke();
            }
            
            
            // create and fill back wall (entrance)
            ctx.beginPath();
            ctx.fillStyle = "#455445";
            ctx.fillRect(447, 185, 250, 300);
            ctx.stroke();
            
        }
        
        else if (type == 'stage_02') {
            // window with space outside
            
            // sky full of stars
            var img = new Image();
            img.src = "images/space_03.png";
            var pat = ctx.createPattern(img, "repeat");
            ctx.rect(60, 180, 1100, 800);
            ctx.fillStyle = pat;
            ctx.fill();
            
            
            // add some glass effect
            ctx.fillStyle = "rgba(200, 200, 200, 0.2)";
            ctx.fillRect(60, 180, 1030, 800);
            
            if (true) {
                var grd = ctx.createLinearGradient(600, 820, 600, 980);
                grd.addColorStop(1, "silver");
                grd.addColorStop(0, "black");
                
                ctx.beginPath();
                ctx.fillStyle = grd;
                ctx.fillRect(60, 785, 1030, 170);
                ctx.stroke();
                
            }
            
            if (true) {
                // draw & fill left wall
                var grd = ctx.createLinearGradient(40, -0, 430, -20);
                // grd.addColorStop(1, "#105310");
                grd.addColorStop(1, "silver");
                grd.addColorStop(0, "black");
                
                ctx.beginPath();
                ctx.moveTo(60, 180);
                ctx.lineTo(180, 180);
                ctx.lineTo(180, 785);
                ctx.lineTo(60, 950);
                ctx.lineTo(60, 180);

                ctx.fillStyle = grd;
                ctx.fill();
                ctx.lineWidth = "3";
                ctx.strokeStyle = 'black';
                ctx.stroke();
            }
            
            if (true) {
                // draw & fill right wall
                // var grd = ctx.createLinearGradient(20, -0, 330, -20);
                var grd = ctx.createLinearGradient(1120, -220, 650, -220);
                grd.addColorStop(1, "silver");
                grd.addColorStop(0, "black");
                
                ctx.beginPath();
                ctx.moveTo(1084, 180);
                ctx.lineTo(964, 180);
                ctx.lineTo(964, 785);
                ctx.lineTo(1084, 950);
                ctx.lineTo(1084, 180);

                ctx.fillStyle = grd;
                ctx.fill();
                ctx.lineWidth = "3";
                ctx.strokeStyle = 'black';
                ctx.stroke();
            }
            
            ctx.beginPath();
            ctx.stroke();
            
        } else {
            // and there too :(
             
        }
        
    }
    
    
    
    function lasers_strike(x_axis, y_axis, counter) {
        // draw laser from top to bottom
        // check if player is in the fire range
        // decrease player's health
        
        // var y_axis = 670;                   // set this as parameter or calc
        
        // think of calculatin y_axis point on the floor; add some effect also
        
        var image = new Image();
        if (counter < 7) {
            image.src = "images/laser_damage01.png";
            
        } else if ((counter > 6) && (counter < 14)) {
            image.src = "images/laser_damage02.png";
            
        } else {
            image.src = "images/laser_damage03.png";
        }
        
        // ctx.drawImage(image, x_axis-50, y_axis-60, 50 + 50*(y_axis/600), 50 + 50*(y_axis/600));
        ctx.drawImage(image, x_axis-45, y_axis-60, 100, 100);
        ctx.stroke();
        
        if (counter < 10) {
            ctx.beginPath();
            ctx.moveTo(x_axis, 150);
            ctx.lineTo(x_axis, y_axis);
            ctx.lineWidth = "8";
            ctx.strokeStyle = '#c83c41';
            ctx.stroke();
            
        } else {
            ctx.beginPath();
            ctx.moveTo(x_axis, 150);
            ctx.lineTo(x_axis, y_axis);
            ctx.lineWidth = "8";
            ctx.strokeStyle = '#c83c41';
            ctx.stroke();
            
            ctx.moveTo(x_axis, 150);
            ctx.lineTo(x_axis, y_axis);
            ctx.lineWidth = "3";
            // ctx.strokeStyle = 'orange';
            ctx.strokeStyle = '#e49c38';
            
            ctx.stroke();
        }
        
        // check position
        if ((Math.abs(playerPosX + 60 - x_axis) < 50) && (Math.abs(playerPosY + 60 - y_axis) < 50)) {
            // you are in the laser range!
            health -= 1;
        }
        
    }
    
    function draw_indicator(type, level) {
        if (level < 0) {
            level = 0;
        }
        var firstItemX = 1395;
        
        if (type == 'health') {
            var begin = 520 - level;
            ctx.beginPath();
            ctx.fillStyle = "#FF3030";
            ctx.fillRect(baseX + firstItemX, baseY + begin, 25, level);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = "3";
            ctx.strokeStyle = "black";
            ctx.rect(baseX + firstItemX, baseY + 420, 25, 100);
            ctx.stroke();
            
        } else if (type == 'ammo') {
            level = Math.floor(level/5);
            var begin = 520 - level;
            ctx.beginPath();
            ctx.fillStyle = "#60FFA0";
            ctx.fillRect(baseX + firstItemX + 45, baseY + begin, 25, level);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.lineWidth = "3";
            ctx.strokeStyle = "black";
            ctx.rect(baseX + firstItemX + 45, baseY + 420, 25, 100);
            ctx.stroke();
            
        } else if (type == 'shield') {
            level = level;
            var begin = 520 - level;
            ctx.beginPath();
            ctx.fillStyle = "#60A0FF";
            ctx.fillRect(baseX + firstItemX + 90, baseY + begin, 25, level);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.lineWidth = "3";
            ctx.strokeStyle = "black";
            ctx.rect(baseX + firstItemX + 90, baseY + 420, 25, 100);
            ctx.stroke();
            
        } else if (type == 'weapon') {
            ctx.beginPath();
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(baseX + 1375, baseY + 420, 300, 100);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.lineWidth = "3";
            ctx.strokeStyle = "black";
            ctx.rect(baseX + 1375, baseY + 420, 300, 100);
            ctx.stroke();
            
        } else if (type == 'timer') {
            ctx.beginPath();
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(baseX + 1170, baseY + 420, 200, 100);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.lineWidth = "3";
            ctx.strokeStyle = "black";
            ctx.rect(baseX + 1170, baseY + 420, 200, 100);
            ctx.stroke();
        }        
    }
    
    
    function draw_rect(color, left, top, right, down) {
        ctx.fillStyle = color;
        ctx.fillRect(left, top, right, down);  
    }
    
    function filled_rect(color, left, top, right, down) {
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.fillStyle = color;
        ctx.fillRect(left, top, right, down);
        ctx.stroke();
        
    }
    
    
    function update_health() {
        if (health > 100)
            health = 100;
        if (health < 0)
            health = 0;
    }
    
    
    function update_ammo() {
        if (ammo > 500)
            ammo = 500;
        if (ammo < 0)
            ammo = 0;
    }
    
    
    function update_shield() {
        if (shield > 100)
            shield = 100;
        if (shield < 0)
            shield = 0;
    }
    
    
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
            }
        return color;
    }
    
    
    function generate_sound() {
        var context = new AudioContext()
        var o = context.createOscillator()
        o.type = "sine"
        o.connect(context.destination)
        o.start()
    }
    
    function write_text_right(text, pos_x, pos_y) {
        // text on it
        ctx.font = "small-caps bold 55px Courier";
        ctx.fillStyle = "white";
        // ctx.fillText(text, baseX + 1540, baseY + 187);
        ctx.fillText(text, baseX + pos_x, baseY + pos_y);
        
        
    }
    
    function write_text(text) {
        ctx.font = "small-caps bold 60px Courier";
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);     // Create gradient
        gradient.addColorStop("0", "black");
        gradient.addColorStop("0.1", "blue");
        gradient.addColorStop("1.0", "black");
        ctx.fillStyle = gradient;                                           // Fill with gradient
        ctx.fillText(text, baseX + 1177, baseY + 487);
    }
    
    
    function write_scene_text(text, pos_x, pos_y) {
        ctx.font = "70px Courier";
        ctx.fillStyle = "blue";
        ctx.fillText(text, pos_x, pos_y);
    }
    
    function number_to_hex(number) {
        var hexString = number.toString(16);
        if (hexString.length % 2) {
          hexString = '0' + hexString;
        }
        return hexString.toUpperCase()
    }
    
    function showTime(){
        var date = new Date();
        var h = date.getHours();        // 0 - 23
        var m = date.getMinutes();      // 0 - 59
        var s = date.getSeconds();      // 0 - 59
        var session = "AM";
        
        if(h == 0){
            h = 12;
        }
        
        if(h > 12){
            h = h - 12;
            session = "PM";
        }
        
        // h = (h < 10) ? "0" + h : h;
        // m = (m < 10) ? "0" + m : m;
        // s = (s < 10) ? "0" + s : s;
        
        h = number_to_hex(h);
        m = number_to_hex(m);
        s = number_to_hex(s);
        
        // var time = h + ":" + m + ":" + s + " " + session;
        // var time = h + ":" + m;
        var time = m + ":" + s;
        return time
    }
    
    
    function play_sound() {
        // play some sound
        return True
    }
    
    function update_radar() {
        radarCounter += 2;
        if (radarCounter > 359) {
            radarCounter = 0;
        }
    }
    
    // ************************** run one time **************************
    // timeDown();
    // generate_sound();
    // rotate_radar();
    // ************************** run one time **************************
    
    
    var i = 0;
    var txt = 'This is very strange\nthing. Your spy bot is\njust went into the\nenemy space ship.\n Your mission is to get\nthe secret data and\nescape from the hostile\nship.\n Good luck...';
    var writingSpeed = 50;
    var nextLine = 0
    var horizontalPos = 0;
    
    function typeWriter() {
        // i think it works fine :)
        if (i < txt.length) {
            if (txt.charAt(i) == "\n") {
                nextLine++;
                horizontalPos = -1;
            }
            write_scene_text(txt.charAt(i), 100 + horizontalPos*40, 280 + 60*nextLine);
            i++;
            horizontalPos++;
            setTimeout(typeWriter, writingSpeed);
        }
    }
    
    function typeWriterRight() {
        // i think it works fine :)
        if (i < txt.length) {
            if (txt.charAt(i) == "\n") {
                nextLine++;
                horizontalPos = -1;
            }
            write_scene_text(txt.charAt(i), 100 + horizontalPos*40, 280 + 60*nextLine);
            i++;
            horizontalPos++;
            setTimeout(typeWriter, writingSpeed);
        }
    }
    
    
    function upStage() {
        StageNumber++;
    }
    
    // function update() {
        // update aka render game
        // update_ammo();
        // update_health();
        // update_shield();
        // time = showTime();
    // }
    
    function draw() {
        filled_rect('#001a33', 1130, 70, 730, 490);           // right background
        
        draw_terminal("");
        
        if (health < 1) {
            var text = "";
            text = "you are dead";
            write_text_right(text, 1540, 167);
            
            text = "your score:";
            write_text_right(text, 1540, 237);
            
            text = totalScore;
            write_text_right(text, 1540, 307);
            
            text = "try again";
            write_text_right(text, 1540, 377);
            
            text = "later...";
            write_text_right(text, 1540, 447);
        }
        
        
        draw_indicator('health', health);
        draw_indicator('ammo', ammo);
        draw_indicator('shield', shield);
        // draw_indicator('weapon', 100);
        draw_indicator('timer', 100);

        // draw_image("AK47");                                             // "AK47", "knife", "gun", "radar", "shell"
        // draw_image("shell");
        draw_radar(radarCounter, playerPosX-545, playerPosY-545);       // put fixed value to debug
        
        write_text(time);                                               // write time in hex representation                                           
        draw_background();      // draw background on the top
    }
    
    
    var lastFrame = 0;
    var delta = 0;
    var timestep = 1000/60;     // frames per second
    
    
    startGame();             // run it here
    
    function mainLoop(timestamp) {
        

        
        // ************************** main loop **************************
        var numUpdateSteps = 0;
        delta += timestamp - lastFrame;
        lastFrame = timestamp;
        while (delta >= timestep) {
          // update();         // my function
          game.update(timestep);
          delta -= timestep;
          time = showTime();

          
          // it seems to work :)
          // try to update player movement in this way
          // after all put all this stuff into update() function
          if (rendered) {
              if (keyUpPressed) {
                  // health += 1;
                  // some
              }
              
              if (keyDownPressed){
                  // health -= 1;
                  // some
              }
              
              if (keyLeftPressed){
                  ammo -= 5;
              }
              
              if (keyRightPressed){
                  ammo += 5;
              }
              rendered = false;
              
          }
          
          
          update_health();          // check if health is in range(0, 100)
          update_ammo();
          update_radar();
          if (++numUpdateSteps >= 240) {
            delta = 0;
            break;
          }
        }
        
        
        if (StageNumber == 0.5) {
            setTimeout(draw_background, 50);        // it makes that left background is darker
            // setTimeout(upStage, 500);
            setTimeout(upStage, 150);
            
            // draw_background();
            // startGame();
            // while (true) {
                // console.log("first scene, before first round");
                // setTimeout(draw_background, 100);
                // draw_background();
                // var some = "thing";
            // }
            // StageNumber = 8;
        } else if (StageNumber == 1) {
            startGame();
            console.log("first round --> lasers on the ceiling");
            
        } else if (StageNumber == 1.5) {
            // ctx.clearRect(0, 0, canvas.width, canvas.height);   // clear whole space
            
            
            filled_rect('black', 60, 180, 1024, 770);           // left background
            filled_rect('black', 1130, 70, 730, 490);           // right background
            console.log("second scene, before second round");
            
            

            // txt = "just for test";                              // if you change txt before typeWriter, it will be ok
            // typeWriter();
            
            setTimeout(upStage, 500);
            // alert("second scene, before second round");
            
        } else if (StageNumber == 2) {
            
            console.log("second round --> ");
            
        } else if (StageNumber == 2.5) {
            
            console.log("third scene, before third round");
            
        } else if (StageNumber == 3) {
            
            console.log("third round --> ");
            
        } else if (StageNumber == 3.5) {
            
            console.log("fourth scene, before fourth round");
            
        } else if (StageNumber == 4) {
            
            console.log("fourth round -->");
            
        } else if (StageNumber == 4.5) {
            
            console.log("fifth scene, before fifth round");
            
        } else if (StageNumber == 5) {
            
            console.log("fifth round -->");
            
        } else if (StageNumber == 6) {
            // it seems to be impossible to get there :|
            console.log("credits");
            
        } else {
            var thing = "some";
            
        }
        
        // game.draw();                    // it covers player object(do not use it -> just as example)
        draw();                     // my function
        rendered = true;            // this stuff is quite fine, use it as well
        
        
        // ************************** main loop **************************
        requestAnimationFrame(mainLoop);
    }
    
    requestAnimationFrame(mainLoop);
// });
};


