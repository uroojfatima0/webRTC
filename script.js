let peerConnection;
let dataChannel;
let localStream;
let screenStream;
const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
let iceCandidates = [];

// Step 1: Get Media Stream (Mic & Camera)
async function getMedia() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("localVideo").srcObject = localStream;
}

function displayMessage(text) {
    const chatBox = document.getElementById("chatBox");
    const newMessage = document.createElement("p");
    newMessage.textContent = text;
    chatBox.appendChild(newMessage);
}

// Step 2: Create Offer
document.getElementById("createOffer").addEventListener("click", async () => {
    await getMedia();

    peerConnection = new RTCPeerConnection(configuration);
    dataChannel = peerConnection.createDataChannel("chat");

    dataChannel.onopen = () => {
        console.log("Data channel opened (Person A) - Ready to send messages");
        setupChat();
    };

    dataChannel.onmessage = (event) => {
        console.log("Message received (Person A):", event.data);
        displayMessage(`Peer: ${event.data}`);
    };

    setupConnectionEvents();
    addStreamToPeer();

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    setTimeout(() => {
        document.getElementById("offerToken").value = btoa(JSON.stringify(peerConnection.localDescription));
    }, 1000);
});

// Step 3: Accept Offer & Generate Answer (Person B)
document.getElementById("acceptOffer").addEventListener("click", async () => {
    await getMedia(); // Ensure media is acquired

    peerConnection = new RTCPeerConnection(configuration);

    peerConnection.ondatachannel = (event) => {
        dataChannel = event.channel;

        dataChannel.onopen = () => {
            console.log("Data channel opened (Person B) - Ready to send messages");
            setupChat(); // Ensure chat is set up after data channel opens
        };

        dataChannel.onmessage = (event) => {
            console.log("Message received (Person B):", event.data);
            displayMessage(`Peer: ${event.data}`);
        };
    };

    setupConnectionEvents();
    addStreamToPeer();

    const offerSDP = JSON.parse(atob(document.getElementById("offerInput").value));
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offerSDP));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    setTimeout(() => {
        document.getElementById("answerToken").value = btoa(JSON.stringify(peerConnection.localDescription));
    }, 1000);
});

// Step 4: Accept Answer (Person A)
document.getElementById("acceptAnswer").addEventListener("click", async () => {
    const answerSDP = JSON.parse(atob(document.getElementById("answerInput").value));
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answerSDP));

    alert("Connection established! Now exchange ICE candidates.");
});

// Step 5: Gather ICE Candidates
document.getElementById("gatherCandidates").addEventListener("click", () => {
    document.getElementById("iceCandidates").value = btoa(JSON.stringify(iceCandidates));
});

// Step 6: Add ICE Candidates
document.getElementById("addIceCandidates").addEventListener("click", async () => {
    const receivedCandidates = JSON.parse(atob(document.getElementById("iceInput").value));
    receivedCandidates.forEach(async (candidate) => {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
    alert("ICE candidates added successfully!");
});

// Step 7: Handle ICE Candidate Collection
function setupConnectionEvents() {
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            iceCandidates.push(event.candidate);
        }
    };

    peerConnection.ontrack = (event) => {
        document.getElementById("remoteVideo").srcObject = event.streams[0];
    };
}

// Step 8: Add Media Stream to Peer Connection
function addStreamToPeer() {
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
}

// Step 9: Microphone Toggle
document.getElementById("toggleMic").addEventListener("click", () => {
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    document.getElementById("toggleMic").textContent = audioTrack.enabled ? "Mute Microphone" : "Unmute Microphone";
});

// Step 10: Camera Toggle
document.getElementById("toggleCam").addEventListener("click", () => {
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    document.getElementById("toggleCam").textContent = videoTrack.enabled ? "Disable Camera" : "Enable Camera";
});

// Step 11: Screen Sharing
document.getElementById("startScreenShare").addEventListener("click", async () => {
    screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const sender = peerConnection.getSenders().find((s) => s.track.kind === "video");
    sender.replaceTrack(screenStream.getVideoTracks()[0]);
    document.getElementById("localVideo").srcObject = screenStream;
});

// Step 12: Stop Screen Sharing
document.getElementById("stopScreenShare").addEventListener("click", async () => {
    const sender = peerConnection.getSenders().find((s) => s.track.kind === "video");
    sender.replaceTrack(localStream.getVideoTracks()[0]);

    document.getElementById("localVideo").srcObject = localStream;
});

// Step 13: Setup Chat Messaging
function setupChat() {
    dataChannel.onmessage = (event) => {
        const chatBox = document.getElementById("chatBox");
        const newMessage = document.createElement("p");
        newMessage.textContent = `Peer: ${event.data}`;
        chatBox.appendChild(newMessage);
    };

    document.getElementById("sendMessage").addEventListener("click", () => {
        const messageInput = document.getElementById("messageInput");

        if (!dataChannel) {
            console.error("Data channel isn't initialized!");
            alert("Data channel isn't initialized!");
            return;
        }

        console.log("Data channel state: ", dataChannel.readyState);

        if (dataChannel.readyState === "open") {
            dataChannel.send(messageInput.value);
            displayMessage(`You: ${messageInput.value}`);
            messageInput.value = "";
        } else {
            alert("Data channel is not open yet!");
        }
    });
}
