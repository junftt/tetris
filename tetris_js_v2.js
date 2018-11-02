window.onload = function()
{
    var canvas = document.getElementById('blackborad');
    var ctx = canvas.getContext('2d');
    
    const BOARD_ROW = 19;//1 row for boundary
    const BOARD_COLUMN = 12;//2 columns for boundary
    const BLOCK_SIZE = 30;
    const HOWMANY_SHAPE = 7;
    const HOWMANY_ORIENTATION = 4;

    var which_shape = 0;
    var which_orientation = 0;
    var row_offset = -4;
    var column_offset = 3;
    var row_speed = 1;
    var column_speed = 0;
    var overall_speed = 2;    
    var one_block = [[],[],[],[]];
    
    //build board
    var board = new Array(BOARD_ROW);
    for(row = 0; row < BOARD_ROW - 1; ++row){
        board[row] = new Array(BOARD_COLUMN);
        board[row][0] = 2;//number 2 represents boundary
        for(column = 1; column < BOARD_COLUMN - 1; ++column){
            board[row][column] = 0;
        }
        board[row][BOARD_COLUMN - 1] = 2;
    }
    board[BOARD_ROW - 1] = new Array(BOARD_COLUMN);
    for(column = 0; column < BOARD_COLUMN; ++column){
        board[BOARD_ROW - 1][column] = 2;
    }
    
    //generate bolcks
    var blocks = [
        [//1 shape of 7                                       
            [[1,0], [1,1], [1,2], [1,3]],//1 orientation of 4 
            [[0,2], [1,2], [2,2], [3,2]],//1111               
            [[2,0], [2,1], [2,2], [2,3]],                     
            [[0,1], [1,1], [2,1], [3,1]]                      
        ],
        [
            [[0,0], [1,0], [1,1], [1,2]],//1
            [[0,2], [0,1], [1,1], [2,1]],//111
            [[1,0], [1,1], [1,2], [2,2]],
            [[0,1], [1,1], [2,1], [2,0]]
        ],
        [
            [[0,2], [1,2], [1,1], [1,0]],//  1
            [[0,1], [1,1], [2,1], [2,2]],//111
            [[2,0], [1,0], [1,1], [1,2]],
            [[0,0], [0,1], [1,1], [2,1]]
        ],
        [
            [[0,1], [0,2], [1,1], [1,2]],//11
            [[0,1], [0,2], [1,1], [1,2]],//11
            [[0,1], [0,2], [1,1], [1,2]],
            [[0,1], [0,2], [1,1], [1,2]]
        ],
        [
            [[0,2], [0,1], [1,1], [1,0]],// 11
            [[0,1], [1,1], [1,2], [2,2]],//11
            [[1,2], [1,1], [2,1], [2,0]],
            [[0,0], [1,0], [1,1], [2,1]]
        ],
        [
            [[0,1], [1,0], [1,1], [1,2]],// 1
            [[0,1], [1,1], [2,1], [1,2]],//111
            [[1,0], [1,1], [1,2], [2,1]],
            [[0,1], [1,1], [2,1], [1,0]]
        ],
        [
            [[0,0], [0,1], [1,1], [1,2]],//11
            [[0,2], [1,2], [1,1], [2,1]],// 11
            [[1,0], [1,1], [2,1], [2,2]],
            [[0,1], [1,1], [1,0], [2,0]]
        ]        
    ];

    function drawBlocks(){//parameter is block's coordinate
        for(num = 0; num<4; ++num){
            ctx.fillStyle = 'rgb(0,0,225)';
            ctx.fillRect((one_block[num][1]+column_offset)*BLOCK_SIZE, (one_block[num][0]+row_offset)*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
    function clearBlocks(){
        for(num = 0; num<4; ++num){
            ctx.clearRect((one_block[num][1]+column_offset)*BLOCK_SIZE, (one_block[num][0]+row_offset)*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
    //initiate one_block
    function resetOneBlock(){
        for(num = 0; num<4; ++num){
            one_block[num] = blocks[which_shape][which_orientation][num];
        }
    }resetOneBlock();
    
    function moveBlocks(){
        setTimeout(moveBlocks, 1000 / overall_speed);
        movedeDetection();
        clearBlocks();//clear和draw做的事情不纯       
        row_offset += row_speed;
        column_offset += column_speed;
        drawBlocks();
    }moveBlocks();

    function reset(){
        updateWhenFilledUp();
        //which_shape = Math.floor(Math.random()*HOWMANY_SHAPE);
        //which_orientation = Math.floor(Math.random()*HOWMANY_ORIENTATION);
        resetOneBlock();
        row_offset = -4;
        column_offset = 3;
        row_speed = 1;
        column_speed = 0;
        overall_speed = 2;
        return;//moveBlocks();这样速度会加倍
    }

    function updateWhenFilledUp(){
        var top = Math.min(one_block[0][0], one_block[1][0], one_block[2][0], one_block[3][0]);
        var bottom = Math.max(one_block[0][0], one_block[1][0], one_block[2][0], one_block[3][0]);
        var dec = 0;
     //   for (asd = bottom; asd>=top; --asd){
        for (asd = 0; asd>=2; --asd){
            for (row_detected = bottom; row_detected>=top; --row_detected){
                for(column = 1; column<BOARD_COLUMN - 1; ++column){
                    if(board[row_detected + row_offset][column] != 1)
                        dec = 1;
                }
                if(dec == 1)
                    break;
                for(row = row_detected + row_offset; row>=0; --row){
                    for(column = 1; column<BOARD_COLUMN - 1; ++column){
                        if(row - 1>=0)
                            board[row][column] = board[row - 1][column];
                        else
                            board[row][column] = 0;
                        ctx.clearRect((column - 1)*BLOCK_SIZE, row*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                        if(board[row][column] == 1){
                            ctx.fillStyle = 'rgb(0,0,225)';
                            ctx.fillRect((column - 1)*BLOCK_SIZE, row*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                        }
                    }
                }   
            }
        }
    }

    function storeOneBlock(){
        for(num = 0; num<4; ++num){//4 blocks
            board[one_block[num][0]+row_offset][one_block[num][1]+column_offset+1] = 1;
        }        
    }
    //chrome 分类插件
    function movedeDetection(key){
        for(num = 0; num<4; ++num){//4 blocks
            if(one_block[num][0]+row_offset+1 >= 0 && board[one_block[num][0]+row_offset+1][one_block[num][1]+column_offset + 1] !== 0){
                storeOneBlock();
                reset();
            }
            if(key == 'a'){
                if(one_block[num][0]+row_offset+1 >= 0 && board[one_block[num][0]+row_offset][one_block[num][1]+column_offset + 1 - 1] !== 0){
                    return false;
                }
            } else if(key == 'd'){
                if(one_block[num][0]+row_offset+1 >= 0 && board[one_block[num][0]+row_offset][one_block[num][1]+column_offset + 2] !== 0){
                    return false;
                }
            }
        }
        return true;
    }
    
    document.body.onkeydown = function (op) {
        switch (op.key) {
            case 'a'://increase performence
                if(movedeDetection('a')){
                clearBlocks();
                column_speed = -1;
                column_offset += column_speed;
                drawBlocks();
                }
                break;
            case 'd':
                if(movedeDetection('d')){
                clearBlocks();
                column_speed = 1;
                column_offset += column_speed;
                drawBlocks();
                }
                break;
            case 's'://accelerate
                clearBlocks();
                overall_speed = 5;
                row_offset += row_speed;//why this line will increase performence
                drawBlocks();
                break;
            case 'w'://change orientation
                clearBlocks();
                which_orientation = (which_orientation+1)%4;
                resetOneBlock();
                drawBlocks();
                break;
        }        
    }
    document.body.onkeyup = function (op) {
        switch (op.key) {
            case"a":
                column_speed = 0;//need i add some codes same as codes above           
                break;
            case"d":
                column_speed = 0;               
            case 's':
                overall_speed = 2;
                break;
        }
    }
}