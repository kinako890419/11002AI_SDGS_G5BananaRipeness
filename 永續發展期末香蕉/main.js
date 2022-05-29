$(document).ready(function(){
    //do something
    $("#thisButton").click(function(){
        processImage();
    });
});

function processImage() {
    
    //請輸入Prediction API的網址
    var uriBase = "https://eastus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/305ab9eb-5c28-43e7-933d-14059c360e6c/classify/iterations/Iteration3/url";
    
    var params = {
    };
    //顯示分析的圖片
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;
    //送出分析
    $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request header
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Prediction-Key", subscriptionKey);
        },
        type: "POST",
        // Request body
        data: '{"Url": ' + '"' + sourceImageUrl + '"}',
    })
    .done(function(data) {
        //顯示JSON內容
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        for(let x=0;x<data.predictions.length;x++){
            if(data.predictions[x].probability >= 0.8 && data.predictions[x].tagName == "ripe"){
                $("#picDescription").text("熟度剛好 (信心:"+ data.predictions[x].probability +")");
                break;
            }
            else if(data.predictions[x].probability >= 0.8 && data.predictions[x].tagName == "overripped"){
                $("#picDescription").text("過熟了 (信心:"+ data.predictions[x].probability +")");
                break;
            }
            else if(data.predictions[x].probability >= 0.8 && data.predictions[x].tagName == "green"){
                $("#picDescription").text("還沒熟 (信心:"+ data.predictions[x].probability +")");
                break;
            }
            else{
            $("#picDescription").text("不是香蕉吧");
            }
            }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        //丟出錯誤訊息
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
};
