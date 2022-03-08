bubbly({
    colorStart: '#000066', //背景色左上
    colorStop: '#aaaaaa',//背景色右下
    blur:1,
    compose: 'source-over',
    bubbleFunc:() => `hsla(${Math.random() * 50}, 20%, 50%, .3)`
  });