#!/bin/bash
# Simple release monitor - checks job status and reports failures immediately

if [ -z "$1" ]; then
    echo "Usage: $0 <run_id>"
    echo "Example: $0 17157434936"
    exit 1
fi

RUN_ID=$1
echo "🔍 Monitoring release run: $RUN_ID"

while true; do
    STATUS=$(gh run view $RUN_ID --json status -q '.status')
    
    if [ "$STATUS" = "completed" ]; then
        CONCLUSION=$(gh run view $RUN_ID --json conclusion -q '.conclusion')
        echo ""
        echo "✅ Run completed with: $CONCLUSION"
        
        if [ "$CONCLUSION" = "failure" ]; then
            echo "❌ FAILURE DETECTED!"
            echo ""
            echo "📋 Failed jobs:"
            gh run view $RUN_ID --json jobs -q '.jobs[] | select(.conclusion=="failure") | "- " + .name'
            echo ""
            echo "🔍 Run details:"
            gh run view $RUN_ID
        else
            echo "🎉 SUCCESS!"
        fi
        break
    else
        echo "⏳ Status: $STATUS - checking again in 30s..."
        sleep 30
    fi
done