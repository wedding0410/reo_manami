bubbly({
    colorStart: '#000033', //背景色左上
    colorStop: '#75A9FF',//背景色右下
    blur:1,
    compose: 'source-over',
    bubbleFunc:() => `hsla(${Math.random() * 50}, 20%, 50%, .3)`
  });