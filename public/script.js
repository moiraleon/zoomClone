const { connect } = require("mongoose")

const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new PerformanceEntry(undefined, {
    host: '/',
    port: '3001'
})

const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    addVideoStream(myVideo, stream)

    socket.on('user-connected', userId =>{
        connectToNewUser(userId,stream)
    })
})

myPeer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream)
    })
}

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadmetadata', ()=>{
        video.play()
    })
    videoGrid.append(video)
}