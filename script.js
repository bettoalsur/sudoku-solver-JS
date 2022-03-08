
let grid = [5,3,0, 0,7,0, 0,0,0,
            6,0,0, 1,9,5, 0,0,0,
            0,9,8, 0,0,0, 0,6,0, 
            8,0,0, 0,6,0, 0,0,3,
            4,0,0, 8,0,3, 0,0,1,
            7,0,0, 0,2,0, 0,0,6,
            0,6,0, 0,0,0, 2,8,0,
            0,0,0, 4,1,9, 0,0,5,
            0,0,0, 0,8,0, 0,7,9];

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
                    for (let k = 0 ; k < 3 ; k++) {
                        gridCopy[sectorIndex+k+ 0] = 10;
                        gridCopy[sectorIndex+k+ 9] = 10;
                        gridCopy[sectorIndex+k+18] = 10;
                    }
                } else if (grid[index] != 0) {
                    gridCopy[index] = 10;
                }
            }
        }
    
        for (let j = 0 ; j < 9 ; j ++) {
            let accRow = 0;
            let accColumn = 0;
            for (let i = 0 ; i < 9 ; i++) {
                let indexForColumn = j + i*9;
                let indexForRow = i + j*9;
                accRow += gridCopy[indexForRow];
                accColumn += gridCopy[indexForColumn];
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
        }
    }

    if (foundNumbers.length == 0) {
        console.log("---");
        consoleMatrix(grid);
        return;
    }

    foundNumbers.forEach(found => grid[found.index] = found.num );
    lookForNumbers();
}

function renderGrid() {
    const gridObject = document.querySelector(".grid");
    let content = "";
    let backGroundColor = "lightblue";

    for (let row = 0 ; row < 9 ; row++) {
        for (let col = 0 ; col < 9 ; col++) {
            let index = col + row*9;
            if ( index%3 == 0 ) {
                if (backGroundColor == "white") backGroundColor = "lightblue";
                else backGroundColor = "white";
            }
            content += `
                <div class="cell" style="background-color: ${backGroundColor};"></div>
            `;
        }
    }
    gridObject.innerHTML = content;
}

renderGrid();
consoleMatrix(grid);
lookForNumbers();