
let grid;

// the easiest sudokus...

grid = [5,3,0, 0,7,0, 0,0,0,
        6,0,0, 1,9,5, 0,0,0,
        0,9,8, 0,0,0, 0,6,0, 
        8,0,0, 0,6,0, 0,0,3,
        4,0,0, 8,0,3, 0,0,1,
        7,0,0, 0,2,0, 0,0,6,
        0,6,0, 0,0,0, 2,8,0,
        0,0,0, 4,1,9, 0,0,5,
        0,0,0, 0,8,0, 0,7,9];

grid = [0,7,4, 0,0,0, 0,0,8,
        0,0,0, 0,0,0, 2,0,0,
        0,0,9, 0,8,2, 7,5,0,
        5,6,0, 0,3,0, 0,0,0,
        8,0,0, 1,0,7, 0,0,2,
        0,0,0, 0,9,0, 0,8,5,
        0,3,5, 6,2,0, 8,0,0,
        0,0,7, 0,0,0, 0,0,0,
        4,0,0, 0,0,0, 9,1,0];

// the hardest sudokus...

grid = [0,0,0, 0,9,0, 3,0,0,
        0,0,0, 1,0,0, 0,0,0,
        0,4,8, 0,0,7, 0,0,1,
        4,2,0, 0,0,5, 0,0,6,
        0,0,6, 0,0,0, 0,0,0,
        0,0,0, 0,0,8, 5,0,0,
        0,0,0, 9,0,0, 2,0,5,
        0,1,2, 5,0,0, 0,6,3,
        7,0,4, 0,0,0, 0,0,8];
/*
grid = [0,4,7, 0,0,1, 0,0,2,
        5,0,0, 0,0,0, 4,0,0,
        9,0,0, 0,4,0, 0,1,5,
        0,3,0, 0,5,2, 0,0,0,
        0,0,0, 7,0,4, 0,0,0,
        0,0,0, 1,8,0, 0,9,0,
        2,7,0, 0,6,0, 0,0,1,
        0,0,1, 0,0,0, 0,0,4,
        3,0,0, 2,0,0, 5,7,0];

grid = [6,0,3, 0,0,0, 2,0,4,
        0,0,0, 9,0,2, 0,0,0,
        0,1,0, 0,0,0, 0,6,0,
        0,0,1, 6,8,9, 7,0,0,
        0,0,0, 0,0,0, 0,0,0,
        0,0,6, 2,4,7, 5,0,0,
        0,9,0, 0,0,0, 0,5,0,
        0,0,0, 5,0,8, 0,0,0,
        5,0,4, 0,0,0, 6,0,1];
*/

let originalGrid = grid.map(x => x);

let sectorMainIndexes = [0,3,6, 27,30,33, 54,57,60];
let sectorIterationIndexes = [0,1,2, 9,10,11, 18,19,20];

function consoleMatrix (matrix) {
    for ( let j = 0 ; j < 9 ; j++ ){
        let row = matrix.slice(j*9 , (j+1)*9 );
        console.log(row);
    }
}

function lookForNumbers() {
    
    let foundNumbers = [];
    
    for (let num = 1 ; num <= 9 ; num++) {
    
        let gridCopy = grid.map(x => x);
    
        for (let j = 0 ; j < 9 ; j ++) {
            for (let i = 0 ; i < 9 ; i++) {
                let index = i + j*9;
                if (grid[index] == num) {
                    // for that row
                    for (let k = j*9 ; k < (j+1)*9 ; k ++ ) {
                        gridCopy[k] = 10;
                    }
                    // for that column
                    for (let k = i ; k < 81 ; k += 9 ) {
                        gridCopy[k] = 10;
                    }
                    // for that sector  
                    let sectorIndex = Math.trunc(i/3)*3 + Math.trunc(j/3)*3 * 9
                    for (let k of sectorIterationIndexes) {
                        gridCopy[sectorIndex+k] = 10;
                    }
                } else if (grid[index] != 0) {
                    gridCopy[index] = 10;
                }
            }
        }
    
        for (let j = 0 ; j < 9 ; j ++) {
            let accRow = 0;
            let accColumn = 0;
            let accSector = 0;
            for (let i = 0 ; i < 9 ; i++) {
                let indexForColumn = j + i*9;
                let indexForRow = i + j*9;
                let indexForSector = sectorMainIndexes[j] + sectorIterationIndexes[i];
                accRow += gridCopy[indexForRow];
                accColumn += gridCopy[indexForColumn];
                accSector += gridCopy[indexForSector];
            }
            if (accRow == 80) {
                for (let i = 0 ; i < 9 ; i++) {
                    let index = i + j*9;
                    if (gridCopy[index] == 0) foundNumbers.push( { index , num } );
                }
            }
            if (accColumn == 80) {
                for (let i = 0 ; i < 9 ; i++) {
                    let index = j + i*9;
                    if (gridCopy[index] == 0) foundNumbers.push( { index , num } );
                }
            }
            if (accSector == 80) {
                for (let i = 0 ; i < 9 ; i++) {
                    let index = sectorMainIndexes[j] + sectorIterationIndexes[i];
                    if (gridCopy[index] == 0) foundNumbers.push( { index , num } );
                }
            }
        }
    }

    if (foundNumbers.length == 0) return;

    foundNumbers.forEach(found => grid[found.index] = found.num );
    lookForNumbers();
}

function lookForMissingNumbers() {

    let foundNumbers = [];

    for (let j = 0; j < 9 ; j++) {
        let rowNumbers = [];
        let colNumbers = [];
        let secNumbers = [];
        for (let i = 0; i < 9 ; i++) {
            let indexForRow = i + j*9;
            let indexForColumn = j + i*9;
            let indexForSector = sectorMainIndexes[j] + sectorIterationIndexes[i];
            rowNumbers.push(grid[indexForRow]);
            colNumbers.push(grid[indexForColumn]);
            secNumbers.push(grid[indexForSector]);
        }

        // for rows...
        let rowMissingNumbers = [];
        let rowMissingIndexes = [];
        // for columns...
        let colMissingNumbers = [];
        let colMissingIndexes = [];
        // for sector...
        let secMissingNumbers = [];
        let secMissingIndexes = [];

        for (let i = 0; i < 9 ; i++) {
            if ( rowNumbers[i] == 0 ) rowMissingIndexes.push(i);
            if ( !rowNumbers.includes(i+1) ) rowMissingNumbers.push(i+1);
            
            if ( colNumbers[i] == 0 ) colMissingIndexes.push(i);
            if ( !colNumbers.includes(i+1) ) colMissingNumbers.push(i+1);

            if ( secNumbers[i] == 0 ) secMissingIndexes.push(i);
            if ( !secNumbers.includes(i+1) ) secMissingNumbers.push(i+1);
        }
        
        // for row...
        for (let col of rowMissingIndexes) {
            let numbers = rowMissingNumbers.map(x => x);
            let currentSector = Math.trunc(col/3)*3 + Math.trunc(j/3)*3 * 9;
            for (let k = numbers.length - 1 ; k >= 0 ; k --) {
                for (let i = 0; i < 9 ; i++) {
                    let indexForColumn = col + i*9;
                    let indexForSector = currentSector + sectorIterationIndexes[i];
                    if (grid[indexForColumn] == numbers[k] || grid[indexForSector] == numbers[k]) {
                        numbers.splice(k,1);
                        break;
                    }
                }
            }
            if (numbers.length == 1) foundNumbers.push( { index: col+j*9 , num: numbers[0] } );
        }

        // for columns...
        for (let row of colMissingIndexes) {
            let numbers = colMissingNumbers.map(x => x);
            let currentSector = Math.trunc(j/3)*3 + Math.trunc(row/3)*3 * 9;
            for (let k = numbers.length - 1 ; k >= 0 ; k --) {
                for (let i = 0; i < 9 ; i++) {
                    let indexForRow = i + row*9;
                    let indexForSector = currentSector + sectorIterationIndexes[i];
                    if (grid[indexForRow] == numbers[k] || grid[indexForSector] == numbers[k]) {
                        numbers.splice(k,1);
                        break;
                    }
                }
            }
            if (numbers.length == 1) foundNumbers.push( { index: j+row*9 , num: numbers[0] } );
        }

        // for sector...
        for (let indexInSector of secMissingIndexes) {
            let numbers = secMissingNumbers.map(x => x);
            let globalIndex = sectorMainIndexes[j] + sectorIterationIndexes[indexInSector];
            let currentRow = Math.trunc(globalIndex/9);
            let currentCol = globalIndex%9;
            for (let k = numbers.length - 1 ; k >= 0 ; k --) {
                for (let i = 0; i < 9 ; i++) {
                    let indexForRow = i + currentRow*9;
                    let indexForColumn = currentCol + i*9;
                    if (grid[indexForRow] == numbers[k] || grid[indexForColumn] == numbers[k]) {
                        numbers.splice(k,1);
                        break;
                    }
                }
            }
            if (numbers.length == 1) foundNumbers.push( { index: globalIndex , num: numbers[0] } );
        }
    }

    if (foundNumbers.length == 0) return;

    foundNumbers.forEach(found => grid[found.index] = found.num);
    lookForMissingNumbers();
}

function solve() {
    lookForNumbers();
    lookForMissingNumbers();
    // funcao para adivinhar...
    renderGrid();
}

// 
// 
// 

function renderGrid() {
    const gridObject = document.querySelector(".grid");
    let content = "";

    let backGroundColor;
    let fontColor;
    let numberToShow;

    for (let row = 0 ; row < 9 ; row++) {
        for (let col = 0 ; col < 9 ; col++) {

            let index = col + row*9;
            let sectorIndex = Math.trunc(col/3)*3 + Math.trunc(row/3)*3 * 9;

            if ( [0,2,4,6,8].map(x => sectorMainIndexes[x]).includes(sectorIndex) ) backGroundColor = "white";
            else backGroundColor = "#D4E6F1";

            if (grid[index] != 0 ) numberToShow = grid[index];
            else numberToShow = "";

            if (originalGrid[index] == 0) fontColor = "rgb(157,157,157)";
            else fontColor = "#151515";

            content += `
                <div class="cell" style="background-color: ${backGroundColor}; color: ${fontColor};">
                    ${numberToShow}
                </div>
            `;
        }
    }
    gridObject.innerHTML = content;
}

let button = document.querySelector(".button");
button.addEventListener("click",solve);

// 
// 
// 

renderGrid();