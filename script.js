const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  // faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  // faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  if (canvas.getContext) {
    document.body.append(canvas)

    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()//.withFaceExpressions()
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      
      // faceapi.draw.drawDetections(canvas, resizedDetections)
      // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

      resizedDetections.forEach(rdetection => {
        
        let ctx = canvas.getContext("2d");
         
        let mouthLandmarks = rdetection.landmarks.getMouth()

        ctx.beginPath()
        ctx.moveTo(mouthLandmarks[0].x, mouthLandmarks[0].y)

        // DRAW UPPER LIP
        let i;
        for (i = 1; i < 7; i++) { 
          ctx.lineTo(mouthLandmarks[i].x, mouthLandmarks[i].y)
        }
        ctx.moveTo(mouthLandmarks[12].x, mouthLandmarks[12].y)
        for (i = 13; i < 17; i++) { 
          ctx.lineTo(mouthLandmarks[i].x, mouthLandmarks[i].y)
        }
        ctx.lineTo(mouthLandmarks[6].x, mouthLandmarks[6].y)
        // ctx.fillStyle = "red"
        // ctx.fill();
        ctx.stroke()
      })


    }, 400)
  }  
})