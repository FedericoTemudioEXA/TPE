"use strict"

document.addEventListener("DOMContentLoaded", load);
function load(){

    let canvas= document.querySelector("#canvas");
    
    /** @type {CanvasRenderingContext2D} */
    let ctx = canvas.getContext("2d");

    let figures = [];
    let board = [];
    let imgBoard = '../img/4-in-line/space.png';
    let tokenSeiya = '../img/4-in-line/fichaseiya.png';
    let tokenHades = '../img/4-in-line/fichahades.png';
    let tokenLeo = '../img/4-in-line/leo.png';
    let tokenMarin = '../img/4-in-line/marin.png';
    let tokenEspectro = '../img/4-in-line/espectro.png';
    let tokenShina = '../img/4-in-line/shina.png';

    let dropZone = [];
    let numColumn = 7;
    let numRow = 6;
    const SIZEPOSBOARD = 40;
    const SIZETOKEN = 20;
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    let player1 = new Player("Jugador 1", 1);
    let player2 = new Player("Jugador 2", 2);

    document.querySelector('#name-player-1').addEventListener('keyup', ()=>{
        player1.setName(document.querySelector('#name-player-1').value);
    });
    document.querySelector('#name-player-2').addEventListener('keyup', ()=>{
        player2.setName(document.querySelector('#name-player-2').value);
    });
    
    let tokensPlayer1 = [];
    let tokensPlayer2 = [];
    let amountTokens = numRow * numColumn;
    let tokensPlayed = 0;
    let inLine = 4;

    let playerTurn = player1;

    let locationBoardX = (canvasWidth/2)-(((numColumn)*SIZEPOSBOARD)/2);
    let locationBoardY = canvasHeight/2-(((SIZEPOSBOARD)*(numRow))/2);


    let widhtBoard = (numColumn * (SIZEPOSBOARD));
    let heightBoard = (numRow * (SIZEPOSBOARD));

    //initEvents();
    initBoard();
    //showPlayerOptions();


    //redibujar el canvas
    /*function redraw(){
        clearCanvas();
        drawBoard();
        drawTokens();
        drawDropZone();
        addTextsButtons();
        setInterval(drawTokens, 20);
    }*/

    

    function initBoard(){
        amountTokens = numRow * numColumn;
        locationBoardX = (canvasWidth/2)-(((numColumn)*SIZEPOSBOARD)/2);
        locationBoardY = canvasHeight/2-(((SIZEPOSBOARD)*(numRow))/2);
        widhtBoard = (numColumn * (SIZEPOSBOARD));
        heightBoard = (numRow * (SIZEPOSBOARD));
        
        tokensPlayed = 0;
        let locationTokenX = locationBoardX;
        let locationTokenY = locationBoardY;
        for(let row = 0; row < numRow; row++){
            let aux = [];
            for (let col = 0; col < numColumn; col++){
                if(col == 0){
                    locationTokenX = locationBoardX;
                } 
                let rect = addRect(locationTokenX, locationTokenY); 
                locationTokenX += SIZEPOSBOARD;
                aux.push(rect)
            }
            locationTokenX -= (SIZEPOSBOARD) * numColumn + SIZEPOSBOARD;
            locationTokenY += (SIZEPOSBOARD);
            figures.push(aux);
        }

        for(let col = 0; col < numColumn; col++){
            let x = locationBoardX + (col * SIZEPOSBOARD);
            let y = locationBoardY - SIZEPOSBOARD;
            let zone = new Zone(x, y, SIZEPOSBOARD, ctx);
            dropZone.push(zone);
        }

        for(let i = 0; i < amountTokens/2; i++){
            //fichas jugador 1
            let posx = Math.round(Math.random() * (locationBoardX - SIZEPOSBOARD*2) + SIZEPOSBOARD);
            let posy = canvasHeight - Math.round(Math.random() * heightBoard) - SIZEPOSBOARD;
            let tokenPlayer1 = new Token(posx, posy, SIZETOKEN, ctx, player1);
            tokensPlayer1.push(tokenPlayer1);

            //fichas jugador 2
            posx = Math.round(Math.random() * ((canvasWidth-SIZEPOSBOARD*2) - (locationBoardX+widhtBoard+SIZEPOSBOARD)) + (locationBoardX+widhtBoard+SIZEPOSBOARD));
            posy = canvasHeight - Math.round(Math.random() * heightBoard) - SIZEPOSBOARD;
            let tokenPlayer2 = new Token(posx, posy, SIZETOKEN, ctx, player2);
            tokensPlayer2.push(tokenPlayer2);
        }

       
        //initEvents();
        
        
        //console.log(board);
        //initTokens();
        drawFigures();
        canvas.addEventListener("mousedown", mouseDown, false);
        canvas.addEventListener("mousemove", mouseMove, false);
        canvas.addEventListener("mouseup", mouseUp, false);
        //console.log(tokensPlayer1);
        //console.log(tokensPlayer2);
        //console.log(figures);
    }

    /*function initEvents(){
        canvas.onmousedown = mouseDown;
        canvas.onmousemove = mouseMove;
        canvas.onmouseup = mouseUp;
    }*/

  /*  function drawDropZone(){
        for(let col = 0; col < numColumn; col++){
            let x = locationBoardX + (col * SIZEPOSBOARD);
            let y = locationBoardY - SIZEPOSBOARD;
            let zone = new Zone(x, y, SIZEPOSBOARD, ctx);
            zone.draw();
            dropZone.push(zone);
        }

    }

    //Crea las fichas y las coloca en ambos lados
    function initTokens(){
        for(let i = 0; i < amountTokens/2; i++){
            //fichas jugador 1
            let posx = Math.round(Math.random() * (locationBoardX - SIZEPOSBOARD*2) + SIZEPOSBOARD);
            let posy = canvasHeight - Math.round(Math.random() * heightBoard) - SIZEPOSBOARD;
            let tokenPlayer1 = new Token(posx, posy, SIZETOKEN, ctx, player1);
            tokensPlayer1.push(tokenPlayer1);

            //fichas jugador 2
            posx = Math.round(Math.random() * ((canvasWidth-SIZEPOSBOARD*2) - (locationBoardX+widhtBoard+SIZEPOSBOARD)) + (locationBoardX+widhtBoard+SIZEPOSBOARD));
            posy = canvasHeight - Math.round(Math.random() * heightBoard) - SIZEPOSBOARD;
            let tokenPlayer2 = new Token(posx, posy, SIZETOKEN, ctx, player2);
            tokensPlayer2.push(tokenPlayer2);
        }
        drawTokens();
    }

    function drawTokens(){
        clearCanvas();
        addTextsButtons();
        drawBoard();
        drawDropZone();
        for(let i = 0; i < tokensPlayer1.length; i++){
            tokensPlayer1[i].drawImg(imgPlayer1);
            tokensPlayer2[i].drawImg(imgPlayer2);
        }
        
    }*/

    function drawFigures(){
        clearCanvas();
        for(let i = 0; i < board.length; i++){
            board[i].drawImg(imgBoard);
        }
        for(let col = 0; col < numColumn; col++){
            dropZone[col].draw();
        }
        for(let i = 0; i < tokensPlayer1.length; i++){
            tokensPlayer1[i].drawImg(tokenSeiya);
            tokensPlayer2[i].drawImg(tokenHades);
        }   
    }

    function clearCanvas(){
        ctx.clearRect(0,0, canvasWidth, canvasHeight);
    }

    /*function drawBoard(){
        for(let i = 0; i < board.length; i++){
            board[i].drawImg(imgBoard);
        }
    }*/

    //agrega fondo de board
    function addRect(locationTokenX, locationTokenY){
        let rect = new Zone(locationTokenX, locationTokenY, SIZEPOSBOARD, ctx);
        board.push(rect);
        //drawBoard();
        return rect;
    }

    //mouse events
    let lastTokenSelected;
    let isMouseDown = false;
    let xInit= 0;
    let Yinit= 0;
    function mouseDown(event){
        isMouseDown = true;
        let coordsCanvas = canvas.getBoundingClientRect();
        let x = Math.round(event.clientX - coordsCanvas.left);
        let y = Math.round(event.clientY - coordsCanvas.top);
        if(lastTokenSelected != null){
            lastTokenSelected.setIsSelected(false);
            lastTokenSelected = null;
        }

        let tokenSelected = findClickedToken(x, y); 
        if(tokenSelected != null && tokenSelected.getPlayer() == playerTurn){
            tokenSelected.setIsSelected(true);
            lastTokenSelected = tokenSelected;
            xInit= lastTokenSelected.getX();
            Yinit= lastTokenSelected.getY();
        } 
        
        drawFigures();
    }

    function initGame(col, row, line){
        numColumn = col;
        numRow = row;
        inLine = line;
        figures = [];
        board = [];
        dropZone = [];
        tokensPlayer1 = [];
        tokensPlayer2 = [];
        playerTurn = player1;
        initTime(false);
        initTime(true);
        initBoard();
        turn.innerHTML = 'Turno de: ' + playerTurn.getName();
    }

    function mouseMove(event){

        let coordsCanvas = canvas.getBoundingClientRect();
        let x = Math.round(event.clientX - coordsCanvas.left);
        let y = Math.round(event.clientY - coordsCanvas.top);
        if(x <10 || x > canvasWidth-10 || y<10 || y >canvasHeight-10){
            console.log("afuera");
            isMouseDown = false;
            moveTokenBack();
            lastTokenSelected=null;
        }
        if(isMouseDown && lastTokenSelected != null){
            lastTokenSelected.move(x, y);
            drawFigures();
        }
    }

    function mouseUp(event){
        let coordsCanvas=canvas.getBoundingClientRect();
        //let x = Math.round(event.clientX - coordsCanvas.left);
        //let y = Math.round(event.clientY - coordsCanvas.top);
        isMouseDown = false;
        let column = checkDropZone();
        let row = putToken(column)
        if(row != false){
            checkWin(row, column);
            changeTurn();
        }else{
            moveTokenBack();
        }
        if(lastTokenSelected != null){
            lastTokenSelected.setIsSelected(false);
        }
        //console.log(figures)
        drawFigures();
    }

    function moveTokenBack(){
        if(lastTokenSelected != null){
            if(lastTokenSelected.getPlayer() == player1){
             lastTokenSelected.move(xInit, Yinit);
            }else{
             lastTokenSelected.move(xInit, Yinit);
            }
        }
        drawFigures();
    }
   
    function findClickedToken(x, y){
        if(playerTurn == player1){
            for(let i = tokensPlayer1.length-1; i >= 0; i--){
                if(tokensPlayer1[i].isClicked(x, y)){
                    return tokensPlayer1[i];
                }
            }
        }else{
            for(let i = tokensPlayer2.length-1; i >= 0; i--){
                if(tokensPlayer2[i].isClicked(x, y)){
                    return tokensPlayer2[i];
                }
            }
        }
    }

    //zone drop
    function checkDropZone(){
        if(lastTokenSelected != null){
            for(let i = 0; i < dropZone.length; i++){
                if(dropZone[i].isDroppedInside(lastTokenSelected.getX(),lastTokenSelected.getY())){
                    //console.log(i)
                    return i;
                }
            }
        } else{
            return null;
        }
    }

    //colocar ficha
    function putToken(column){
        if(column != undefined){
            for(let i = 0; i < numRow; i++){
                let x = locationBoardX + SIZETOKEN + (SIZEPOSBOARD * column);
                let y = locationBoardY + SIZETOKEN + (SIZEPOSBOARD * i);
                if(i == numRow-1 && !figures[i][column].getIsTokenInside()){
                    figures[i][column].setIsTokenInside(true);
                    figures[i][column].setToken(lastTokenSelected);
                    lastTokenSelected.move(x+3, y+3);
                    lastTokenSelected.setCanMove(false);
                    tokensPlayed++;
                    drawFigures();
                    return i;
                }else{
                    if((!figures[i][column].getIsTokenInside())){
                        if(figures[i+1][column].getIsTokenInside()){
                            figures[i][column].setIsTokenInside(true);
                            figures[i][column].setToken(lastTokenSelected);
                            lastTokenSelected.move(x+3, y+3);
                            lastTokenSelected.setCanMove(false);
                            tokensPlayed++;
                            drawFigures();
                            return i;
                        }
                    }
                }
            }
            return false;
        }else{
            return false;
        }
    }

    //cambiar turno de jugador
    let turn = document.querySelector('#playerTurn');
    turn.innerHTML = 'Turno de: ' + playerTurn.getName();
    function changeTurn(){
        if(playerTurn == player1){
            playerTurn = player2;
        }else{
            playerTurn = player1;
        }
        turn.innerHTML = 'Turno de: ' + playerTurn.getName();
    }

    /*function showPlayerOptions(){
        document.querySelector("#name-player-1").value=player1.getName();
        document.querySelector("#name-player-2").value=player2.getName();

    }*/

    //********** LOGICA WIN *************//
    function checkWin(row, column){
        if(amountTokens == tokensPlayed){
           
            openModal("Empate");
            finishGame();
        }
        if(winRow(row, column) || winColumn(row, column) || winDiag(row, column)){
          
            openModal("El ganador es: " + playerTurn.getName());
            finishGame();
        }
    }

    function finishGame(){
        initTime(false);
        for(let i = 0; i < tokensPlayer1.length; i++){
            tokensPlayer1[i].setCanMove(false);
            tokensPlayer2[i].setCanMove(false);
        }
    }

    //win diagonal//
    function winDiag(row, column){
        let leftDown = inLineLeftDown(row, column);
        let LeftUp = inLineLefttUp(row, column);
        let rightDown = inLineRightDown(row, column);
        let rightUp = inLineRightUp(row, column);
        if((leftDown + rightUp + 1 >= inLine) || (LeftUp + rightDown + 1 >= inLine)){
            return true;
        }
    }

    function inLineLeftDown(row, column){
        let found = false;
        let i = 1;
        let count = 0;
        while(found != true){
            if(row+i < numRow && column-i > -1){
                let token = figures[row+i][column-i].getToken();
                if(token != null){
                    if (token.getPlayer() == lastTokenSelected.getPlayer()){
                        count++;
                    }else{
                        found = true;
                    }
                }else{
                    found = true;;
                }
            }else{
                found = true;
            }
            i++;
        }
        return count;
    }

    function inLineLefttUp(row, column){
        let found = false;
        let i = 1;
        let count = 0;
        while(found != true){
            if(row-i > -1 && column-i > -1){
                let token = figures[row-i][column-i].getToken();
                if(token != null){
                    if (token.getPlayer() == lastTokenSelected.getPlayer()){
                        count++;
                    }else{
                        found = true;
                    }
                }else{
                    found = true;;
                }
            }else{
                found = true;
            }
            i++;
        }
        return count;
    }

    function inLineRightDown(row, column){
        let found = false;
        let i = 1;
        let count = 0;
        while(found != true){
            if(row+i < numRow && column+i < numColumn){
                let token = figures[row+i][column+i].getToken();
                if(token != null){
                    if (token.getPlayer() == lastTokenSelected.getPlayer()){
                        count++;
                    }else{
                        found = true;
                    }
                }else{
                    found = true;;
                }
            }else{
                found = true;
            }
            i++;
        }
        return count;
    }

    function inLineRightUp(row, column){
        let found = false;
        let i = 1;
        let count = 0;
        while(found != true){
            if(row-i > -1 && column+i < numColumn){
                let token = figures[row-i][column+i].getToken();
                if(token != null){
                    if (token.getPlayer() == lastTokenSelected.getPlayer()){
                        count++;
                    }else{
                        found = true;
                    }
                }else{
                    found = true;;
                }
            }else{
                found = true;
            }
            i++;
        }
        return count;
    }

    //win columna//
    function winColumn(row, column){
        let up = winColumnUp(row, column);
        let down = winColumnDown(row, column);
        if(up + down + 1 >= inLine){
            return true;
        }
    }

    function winColumnDown(row, column){
        let found = false;
        let i = 1;
        let count = 0;
        while(found != true){
            if(row-i > -1){
                let token = figures[row-i][column].getToken();
                if(token != null){
                    if (token.getPlayer() == lastTokenSelected.getPlayer()){
                        count++;
                    }else{
                        found = true;
                    }
                }else{
                    found = true;;
                }
            }else{
                found = true;
            }
            i++;
        }
        return count;
    }

    function winColumnUp(row, column){
        let found = false;
        let i = 1;
        let count = 0;
        while(found != true){
            if(row+i < numRow){
                let token = figures[row+i][column].getToken();
                if(token != null){
                    if (token.getPlayer() == lastTokenSelected.getPlayer()){
                        count++;
                    }else{
                        found = true;
                    }
                }else{
                    found = true;
                }
            }else{
                found = true;
            }
            i++;
        }
        return count;
    }

    //win fila//
    function winRow(row, column){
        let left = winRowLeft(row, column);
        let right = winRowRight(row, column);
        if(left + right + 1 >= inLine){
            return true;
        }
    }

    function winRowLeft(row, column){
        let found = false;
        let i = 1;
        let count = 0;
        while(found != true){
            if(column-i > -1){
                let token = figures[row][column-i].getToken();
                if(token != null){
                    if (token.getPlayer() == lastTokenSelected.getPlayer()){
                        count++;
                    }else{
                        found = true;
                    }
                }else{
                    found = true;;
                }
            }else{
                found = true;
            }
            i++;
        }
        return count;
    }

    function winRowRight(row, column){
        let found = false;
        let i = 1;
        let count = 0;
        while(found != true){
            if(column+i < numColumn){
                let token = figures[row][column+i].getToken();
                if(token != null){
                    if (token.getPlayer() == lastTokenSelected.getPlayer()){
                        count++;
                    }else{
                        found = true;
                    }
                }else{
                    found = true;;
                }
            }else{
                found = true;
            }
            i++;
        }
        return count;
    }

    
    //jugar 4 en linea
    document.querySelector('#play-canvasGame').addEventListener('click', ()=>{
        document.querySelector('.play-canvasGame').style.display = "flex";
        document.querySelector('.section-image').style.display = "none";
        initTime(true);
    })

    //Timer de juego
    let timer = 0;
    function initTime(bool) {
        let element = document.getElementById('test');
        let startMinutes = 3;
        let time = startMinutes * 60;
        
        if(bool){
            timer = setInterval(()=>{
                let minutes = Math.floor(time / 60);
                let seconds = time % 60;
                seconds = seconds < 10 ? '0' + seconds : seconds;
                element.innerHTML = `${minutes}:${seconds}`;
    
                if(minutes == 0 && seconds == 10){
                    element.style.color = "red";
                }
                if(minutes == 0 && seconds == 0){
                    clearInterval();
                    finishGame();
    
                }else{
                    time--;
                }     
            }, 1000);
        }else{
            clearInterval(timer);
        }
    }  

    //Botones de tamaño de tablero
    document.querySelector('#btn-x4-inLine').addEventListener('click', ()=>{
        initGame(7, 6, 4);
    })

    document.querySelector('#btn-x5-inLine').addEventListener('click', ()=>{
        initGame(8, 7, 5);
    })

    document.querySelector('#btn-x6-inLine').addEventListener('click', ()=>{
        initGame(9, 8, 6);
    })

    document.querySelector('#btn-x7-inLine').addEventListener('click', ()=>{
        initGame(10, 9, 7);
    })

    //Boton reiniciar
    document.querySelector('#restartGame').addEventListener('click', ()=>{
        figures = [];
        board = [];
        dropZone = [];
        tokensPlayer1 = [];
        tokensPlayer2 = [];
        playerTurn = player1;  
        initBoard();  
        initTime(false);
        initTime(true);
        turn.innerHTML = 'Turno de: ' + playerTurn.getName();
    })

    //Fichas
    //Player 1
    document.querySelector('#tokenSeiya').addEventListener('click', ()=>{
        for(let i = 0; i < tokensPlayer1.length; i++){
            tokensPlayer1[i].setImage(tokenSeiya);
        }  
    })

    document.querySelector('#tokenLeo').addEventListener('click', ()=>{
        for(let i = 0; i < tokensPlayer1.length; i++){
            tokensPlayer1[i].setImage(tokenLeo);
        }  
    })

    document.querySelector('#tokenMarin').addEventListener('click', ()=>{
        for(let i = 0; i < tokensPlayer1.length; i++){
            tokensPlayer1[i].setImage(tokenMarin);
        }  
    })

    //Player 2
    document.querySelector('#tokenHades').addEventListener('click', ()=>{
        for(let i = 0; i < tokensPlayer2.length; i++){
            tokensPlayer2[i].setImage(tokenHades);
        }  
    })

    document.querySelector('#tokenEspectro').addEventListener('click', ()=>{
        for(let i = 0; i < tokensPlayer2.length; i++){
            tokensPlayer2[i].setImage(tokenEspectro);
        }  
    })

    document.querySelector('#tokenShina').addEventListener('click', ()=>{
        for(let i = 0; i < tokensPlayer2.length; i++){
            tokensPlayer2[i].setImage(tokenShina);
        }  
    })

    function openModal(string){
        let modal = document.querySelector('#modalWinner');
        let closeModal = document.querySelector('#closeModal');
        let text = document.querySelector('#string');
        modal.classList.add('modal-flex');
        text.innerHTML = string;
    
        closeModal.onclick = function(){
            modal.classList.remove('modal-flex');
        }
    
        modal.onclick = function(){
            modal.classList.remove('modal-flex');
        }   
    }

    
}


