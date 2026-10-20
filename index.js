const express = require('express');
const { exec } = require('child_process');
const app = express();

app.get('/', (req, res) => {
    res.send('Service is running. Go to /test to run FFmpeg.');
});

app.get('/test', (req, res) => {
    const start = Date.now();
    const memBefore = process.memoryUsage().rss / 1024 / 1024;
    
    // أمر FFmpeg: إنشاء فيديو وهمي 5 ثوانٍ، 360p، ومعالجته
    const cmd = `ffmpeg -f lavfi -i testsrc=duration=5:size=640x360:rate=30 -c:v libx264 -preset ultrafast -threads 1 -y /tmp/test.mp4 && ls -lh /tmp/test.mp4`;

    exec(cmd, { timeout: 60000 }, (error, stdout, stderr) => {
        const end = Date.now();
        const memAfter = process.memoryUsage().rss / 1024 / 1024;
        
        if (error) {
            return res.json({ 
                success: false, 
                error: error.message, 
                timeMs: end - start,
                memBeforeMB: memBefore.toFixed(2),
                memAfterMB: memAfter.toFixed(2)
            });
        }
        res.json({
            success: true,
            timeMs: end - start,
            memBeforeMB: memBefore.toFixed(2),
            memAfterMB: memAfter.toFixed(2),
            output: stdout
        });
    });
});

app.listen(10000, () => console.log('Test service listening on 10000'));
