// pages/runtime/runtime.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grid: Array(4).fill().map(() => Array(4).fill(0)),// 4*4的二维数组
    score: 0,
    audioContext: null,
    //   const grid1 = [],
    // for (let i = 0; i < 4; i++) {
    //   grid1[i] = []; // 初始化每一行
    //   for (let j = 0; j < 4; j++) {
    //     grid1[i][j] = 0; // 初始化每个元素为 0
    //   }
    // }
  },
  // 数组下标转换（1,2）->（2,1）
  transpose(grid) {
    // ok
    return grid[0].map((_, i) => grid.map(row => row[i]));
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad(options) {
    this.audioInit();
    this.startGame();
  },

  audioInit() {
    const audioContext = wx.createInnerAudioContext();
    this.audioContext = audioContext;
    if (audioContext == null) {
      console.log("audioContext is null");
    };
    audioContext.src = 'assets/music.mp3';
    if (audioContext.src == null) {
      console.log("audioContext.src is null");
    };
    audioContext.loop = true;
    audioContext.play();
  },

  startGame() {
    let grid = Array(4).fill().map(() => Array(4).fill(0));//let定义局部变量
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

  onTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    console.log(this.touchStartX, this.touchStartY);
  },

  onTouchEnd(event) {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
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
    // abcd->dcba
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
    // 左滑动
    let newGrid = Array(4).fill().map(() => Array(4).fill(0)); // 初始化 newGrid
    let newScore = this.data.score; // 初始化 newScore

    for (let i = 0; i < 4; i++) {
      let col = 0;//col是新的列数
      for (let j = 0; j < 4; j++) {

        if (grid[i][j] !== 0) {
          // 三种情况
          if (newGrid[i][col] === 0) {
            // 移动
            newGrid[i][col] = grid[i][j];

          } else if (newGrid[i][col] === grid[i][j]) {
            // 相同合并
            newGrid[i][col] *= 2;
            newScore += newGrid[i][col]; // 更新 newScore
            col++;

          } else {
            // 不同则将col移动到下一列(循环)，
            col++;
            newGrid[i][col] = grid[i][j];
          }
        }
      }

    }
    this.setData({ score: newScore }); // 更新 score和格子
    return newGrid;
  },



  gridsEqual(grid1, grid2) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid1[i][j] !== grid2[i][j]) return false;
      }
    }
    return true;
  },

  // 检查游戏是否结束

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
    this.audioContext.destroy();
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

  // goBack: function () {
  //   wx.navigateBack({
  //     delta: 1 // 返回上一级页面
  //   });
  // }

})
