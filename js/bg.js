bubbly({
    colorStart: '#fcf7f2', //背景色左上
    colorStop: '#fcf9f5',　//背景色右下
    blur:1,
    compose: 'source-over',
    bubbleFunc:() => `hsla(${Math.random() * 50}, 20%, 50%, .3)`
  });