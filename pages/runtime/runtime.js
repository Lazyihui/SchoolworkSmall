// // pages/runtime/runtime.js
// Page({

//     /**
//      * 页面的初始数据
//      */
//     data: {

//     },

//     /**
//      * 生命周期函数--监听页面加载
//      */
//     onLoad(options) {

//     },

//     /**
//      * 生命周期函数--监听页面初次渲染完成
//      */
//     onReady() {

//     },

//     /**
//      * 生命周期函数--监听页面显示
//      */
//     onShow() {

//     },

//     /**
//      * 生命周期函数--监听页面隐藏
//      */
//     onHide() {

//     },

//     /**
//      * 生命周期函数--监听页面卸载
//      */
//     onUnload() {

//     },

//     /**
//      * 页面相关事件处理函数--监听用户下拉动作
//      */
//     onPullDownRefresh() {

//     },

//     /**
//      * 页面上拉触底事件的处理函数
//      */
//     onReachBottom() {

//     },

//     /**
//      * 用户点击右上角分享
//      */
//     onShareAppMessage() {

//     },


  
// })
Page({
    
    data: {
      grid: Array(4).fill().map(() => Array(4).fill(0)),
      score: 0,
    },
  
    onLoad() {
      this.startGame();
    },
  
    startGame() {
      let grid = Array(4).fill().map(() => Array(4).fill(0));
      this.addRandomTile(grid);
      this.addRandomTile(grid);
      this.setData({ grid, score: 0 });
    },
  
    addRandomTile(grid) {
      let emptyCells = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (grid[i][j] === 0) {
            emptyCells.push({ x: i, y: j });
          }
        }
      }
      if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
      }
    },
  
    restartGame() {
      this.startGame();
    },
  
    onTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    },
  
    onTouchEnd(e) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - this.touchStartX;
      const dy = touchEndY - this.touchStartY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          this.moveRight();
        } else {
          this.moveLeft();
        }
      } else {
        if (dy > 0) {
          this.moveDown();
        } else {
          this.moveUp();
        }
      }
    },
  
    moveLeft() {
      let grid = this.data.grid;
      let newGrid = this.slideAndMerge(grid);
      if (this.gridsEqual(grid, newGrid)) return;
      this.addRandomTile(newGrid);
      this.setData({ grid: newGrid });
    },
  
    moveRight() {
      let grid = this.data.grid;
      let newGrid = this.slideAndMerge(grid.map(row => row.slice().reverse())).map(row => row.reverse());
      if (this.gridsEqual(grid, newGrid)) return;
      this.addRandomTile(newGrid);
      this.setData({ grid: newGrid });
    },
  
    moveUp() {
      let grid = this.data.grid;
      let newGrid = this.transpose(this.slideAndMerge(this.transpose(grid)));
      if (this.gridsEqual(grid, newGrid)) return;
      this.addRandomTile(newGrid);
      this.setData({ grid: newGrid });
    },
  
    moveDown() {
      let grid = this.data.grid;
      let newGrid = this.transpose(this.slideAndMerge(this.transpose(grid).map(row => row.reverse())).map(row => row.reverse()));
      if (this.gridsEqual(grid, newGrid)) return;
      this.addRandomTile(newGrid);
      this.setData({ grid: newGrid });
    },
  
    slideAndMerge(grid) {
      let newGrid = Array(4).fill().map(() => Array(4).fill(0));
      for (let i = 0; i < 4; i++) {
        let col = 0;
        for (let j = 0; j < 4; j++) {
          if (grid[i][j] !== 0) {
            if (newGrid[i][col] === 0) {
              newGrid[i][col] = grid[i][j];
            } else if (newGrid[i][col] === grid[i][j]) {
              newGrid[i][col] *= 2;
              this.setData({ score: this.data.score + newGrid[i][col] });
              col++;
            } else {
              col++;
              newGrid[i][col] = grid[i][j];
            }
          }
        }
      }
      return newGrid;
    },
  
    transpose(grid) {
      return grid[0].map((_, i) => grid.map(row => row[i]));
    },
  
    gridsEqual(grid1, grid2) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (grid1[i][j] !== grid2[i][j]) return false;
        }
      }
      return true;
    },

    // nextPage按钮绑定
    goBack: function () {
      wx.navigateBack({
        delta: 1 // 返回上一级页面
      });
    }
  });