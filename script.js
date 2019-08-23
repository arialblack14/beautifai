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
      
      resizedDetections.forEach(rdetection => {
        
        let ctx = canvas.getContext("2d");
         
        let mouthLandmarks = rdetection.landmarks.getMouth()

        ctx.beginPath()
        ctx.moveTo(mouthLandmarks[0].x, mouthLandmarks[0].y)

        let i;
        for (i = 0; i < mouthLandmarks.length; i++) { 
          ctx.lineTo(mouthLandmarks[i].x, mouthLandmarks[i].y)
          ctx.fillStyle = "red"
          ctx.fill();
        }
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        // console.log(mouthLandmarks)

        // mouthLandmarks.forEach(mark => {
        //   // ctx.moveTo(mark.x, mark.y);
        //   // ctx.lineTo(mark.x, mark.y);
        //   // ctx.lineTo(mark.x, mark.y);
        //   // ctx.closePath();
        //   // ctx.stroke();
        //   // ctx.fill();
        //   // ctx.fillStyle = "red";
        //   // ctx.fillRect(mark.x, mark.y, mark.x, mark.y)
           
        //   ctx.beginPath();
        //   ctx.moveTo(mark.x, mark.y);
        //   ctx.lineTo(10, 70);
        //   ctx.lineTo(90, 70);
        //   ctx.fill();
        // })
      })


    }, 400)
  }  
})