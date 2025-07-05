import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const ManualScreen = () => {
  const formHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <!-- Escala embed formddd4b5ba-45f4-4979-95b5-f1114ff78db7--><script id="escala-form-ddd4b5ba-45f4-4979-95b5-f1114ff78db7-ran01690235122017435dom" data-version="0.1.0">window["escala-form-ddd4b5ba-45f4-4979-95b5-f1114ff78db7-ran01690235122017435dom"]={e:"page",f:"ddd4b5ba-45f4-4979-95b5-f1114ff78db7",l:"es",r:"ran01690235122017435dom"};function escInitFormImpl(opts){(function(){var eventMethod=window.addEventListener?"addEventListener":"attachEvent";var eventer=window[eventMethod];var messageEvent=eventMethod==="attachEvent"?"onmessage":"message";eventer(messageEvent,function(e){if(e.data.origin==="escalaForm"){if(e.data.eventName==="init"&&e.data.height){const iframe=document.querySelector("[escala-element-form=\\"escala-form-"+e.data.instance+"\\"]");if(iframe)iframe.height=e.data.height}else if(e.data.eventName==="escala_lead"){if(typeof fbq==="function"){if(e.data.leadData&&e.data.leadData.contact_email){fbq("track","Lead",{email:e.data.leadData.contact_email},{eventID:e.data.leadData.deduplicationId})}else{fbq("track","Lead",{},{eventID:e.data.leadData.deduplicationId})}}
  if(typeof gtag==="function"){if(e.data.leadData&&e.data.leadData.contact_email){gtag("event","generate_lead",{"event_category":"engagement","event_label":"escala_lead","email":e.data.leadData.contact_email})}else{gtag("event","generate_lead",{"event_category":"engagement","event_label":"escala_lead"})}}
  if(typeof dataLayer!=="undefined"&&dataLayer.push&&typeof dataLayer.push==="function"){if(e.data.leadData&&e.data.leadData.contact_email){dataLayer.push({"event":"escala_lead","email":e.data.leadData.contact_email})}else{dataLayer.push({"event":"escala_lead"})}}}}});var iframeId="escala-iframe-{f}-{l}-{r}".replace("{f}",opts.f).replace("{l}",opts.l).replace("{r}",opts.r);var iframeElem=document.getElementById(iframeId);if(iframeElem)iframeElem.remove();iframeElem=document.createElement("iframe");var host=btoa(JSON.stringify({loc:location.href,title:encodeURIComponent(document.title),ref:document.referrer}));var instance=(opts.f+"-"+opts.r+"-"+(Math.random())).replace(".","-");var params="form="+opts.f+"&lang="+opts.l+"&instance="+instance+"&host="+host+"&v="+(Math.random());try{var parent_location=window.location.toString();parent_params=parent_location.split('?');if(parent_params.length>1){params+='&'+parent_params[1]}}catch(e){}
  iframeElem.setAttribute("src","https://escalapages.com/plugins/forms/embed.html?"+params);var attrs=["marginwidth","marginheight","frameborder","vspace","hspace"];for(var i=0;i<attrs.length;i++){iframeElem.setAttribute(attrs[i],"0")}
  iframeElem.setAttribute("scrolling","no");iframeElem.width="100%";iframeElem.setAttribute("escala-element-form","escala-form-"+instance);iframeElem.setAttribute("id",iframeId);var scriptElem=document.getElementById("escala-form-"+opts.f+"-"+opts.r);var body=document.getElementsByTagName("body")[0];if(body.contains(scriptElem)){scriptElem.parentElement.appendChild(iframeElem)}else{body.appendChild(iframeElem)}}())}
function escInitForm(){var opts=window["escala-form-ddd4b5ba-45f4-4979-95b5-f1114ff78db7-ran01690235122017435dom"];if(opts.e==="elementor-popup"){jQuery(document).ready(function(){jQuery(document).on("elementor/popup/show",()=>{escInitFormImpl(opts)})})}else{escInitFormImpl(opts)}}
if(window.addEventListener)
  window.addEventListener("load",escInitForm,!1);else if(window.attachEvent)
  window.attachEvent("onload",escInitForm);else window.onload=escInitForm;</script><!-- Escala embed formddd4b5ba-45f4-4979-95b5-f1114ff78db7-->
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: formHtml }}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50,
  },
  webview: {
    flex: 1,
  },
});

export default ManualScreen;
