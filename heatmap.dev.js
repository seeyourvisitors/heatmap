'use strict';
(function (parentWindow) {
  var heatmap
  var regexReplace = /[\/\$#\[\]\.]/
  var path = document.location.host.split(regexReplace).join('_') + document.location.pathname.split(regexReplace).join('_')
  var timeLoad = new Date().getTime()

  var calcValue = function (a) {
    var timeSpent = new Date().getTime() - timeLoad
    return Math.log(timeSpent) * a
  }

  var el = document.getElementsByTagName('body')[0]
  var config = {
    'radius': 60,
    'container': el,
    'visible': true,
    'opacity': 0.7,
    // this line makes datapoints unblurred
    'blur': 1
  }

  var body = document.body
  var html = document.documentElement

  config.width = Math.max(body.scrollWidth, body.offsetWidth,
                         html.clientWidth, html.scrollWidth, html.offsetWidth)
  config.height = Math.max(body.scrollHeight, body.offsetHeight,
                         html.clientHeight, html.scrollHeight, html.offsetHeight)

  heatmap = window.h337.create(config)

  window.firebase.database().ref('events/' + path).on('child_added', function (snapshot) {
    var d = snapshot.val()
    if (d.a === 'click') {
      heatmap.addData({x: d.x, y: d.y, value: calcValue(0.5)})
    } else {
      heatmap.addData({x: d.x, y: d.y, value: calcValue(0.2)})
    }
    console.log('Event', d)
  }, function (err) {
    console.log(err)
  })

  window.firebase.database().ref('users').on('value', function (snapshot) {
    console.log(snapshot.val())
  }, function (err) {
    console.log(err)
  })

  window.firebase.database().ref('views/' + path).on('child_added', function (snapshot) {
    console.log('View', snapshot.val())
  }, function (err) {
    console.log(err)
  })
})(window)
