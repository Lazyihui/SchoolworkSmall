// pages/runtime/runtime.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grid: Array(4).fill().map(() => Array(4).fill(0)),// 4*4的二维数组
    score: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad(options) {
      console.log(this.data.grid,this.data.score);
    this.startGame();
  },

  startGame() {
    let grid = Array(4).fill().map(() => Array(4).fill(0));//let定义局部变量
    grid[3][0] = 4;
    this.addRandomTile(grid);
    this.addRandomTile(grid);//初始化两个随机数
    this.setData({
      grid: grid,
      score: 0,
    });//更新数据
    console.log(grid);

  },

  // 随机生成一个2或4
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
      let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];//随机生成一个空白格子
      grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
      this.setData({ grid }); // 更新 grid 数据
    }
  },

  onTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    console.log(this.touchStartX, this.touchStartY);
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
    console.log(grid);

  },

  moveRight() {
    let grid = this.data.grid;
    let newGrid = this.slideAndMerge(grid.map(row => row.slice().reverse())).map(row => row.reverse());
    if (this.gridsEqual(grid, newGrid)) return;
    this.addRandomTile(newGrid);
    this.setData({ grid: newGrid });
    console.log(grid);

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
    console.log(grid);

  },

  slideAndMerge(grid) {
    // 逐行处理ok
    let newGrid = Array(4).fill().map(() => Array(4).fill(0));
    let newScore = this.data.score; // 初始化 newScore
    for (let i = 0; i < 4; i++) {
      let col = 0;
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] !== 0) {
          if (newGrid[i][col] === 0) {
            newGrid[i][col] = grid[i][j];
          } else if (newGrid[i][col] === grid[i][j]) {
            newGrid[i][col] *= 2;
            newScore += newGrid[i][col]; // 更新 newScore
            col++;
          } else {
            col++;
            newGrid[i][col] = grid[i][j];
          }
        }
      }
    }
    this.setData({ score: newScore }); // 更新 score
    return newGrid;
  },

  transpose(grid) {
    // ok
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  restartGame() {
    this.startGame();
    this.setData({ score: 0 }); // 重置 score
  },
  //  nextPage按钮绑定
  goBack: function () {
    wx.navigateBack({
      delta: 1 // 返回上一级页面
    });
  }

})
