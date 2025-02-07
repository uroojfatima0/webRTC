# WebRTC Peer-to-Peer Communication (No Signaling Server)

## Overview
This project enables direct peer-to-peer communication using WebRTC without a signaling server. Users can manually exchange SDP tokens and ICE candidates to establish a connection.

## Features
- Manual SDP Offer/Answer Exchange
- ICE Candidate Exchange
- Real-time Text Messaging via DataChannel
- Microphone Mute/Unmute Control
- Camera Enable/Disable Control
- Screen Sharing

## Prerequisites
- A modern browser (Chrome, Firefox, Edge)
- Stable internet connection

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/uroojfatima0/webRTC
   cd webrtc-p2p
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the project by opening index.html in your browser.

## Usage Guide

### 1. Generating the SDP Offer Token
- Person A clicks "Generate Offer".
- A token is generated and displayed.
- Copy and share this token with Person B.

### 2. Entering the Offer Token & Generating an Answer
- Person B pastes the received token into the input field.
- Click "Accept Offer".
- Copy the answer token and send it back to Person A.

### 3. Accepting an Answer
- The person A will paste this token into Enter Answer Token input field.
- Now they are able to exchange ICE Candidates

### 4. Exchanging ICE Candidates
- Both users will collect ICE candidates by clicking Gather ICE Candidates.
- Manually exchange and paste them into the respective input fields.
- Click "Add ICE Candidates".

### 5. Establishing the Connection
- Once tokens and ICE candidates are exchanged, the video/audio connection should be established.

### 6. Sending Messages
- Type a message in the input box and click "Send".
- Messages will be sent in real-time via WebRTC DataChannel.

### 7. Microphone & Camera Controls
- Use the **Mute/Unmute** button to control the microphone.
- Use the **Enable/Disable Camera** button to control the webcam.

### 8. Screen Sharing
- Click **Start Screen Share** to share your screen.
- Click **Stop Screen Share** to stop sharing.

## Troubleshooting
- **No video/audio connection?** Ensure both users have exchanged ICE candidates properly.
- **Messages not appearing?** The DataChannel might not be connected. Refresh and try again.

## License
This project is open-source.
