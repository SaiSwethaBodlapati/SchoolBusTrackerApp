const step1 = document.querySelector(".step1"),
      step2 = document.querySelector(".step2"),
      step3 = document.querySelector(".step3"),
      emailAddress = document.getElementById("emailAddress"),
      verifyEmail = document.getElementById("verifyEmail"),
      inputs = document.querySelectorAll(".otp-group input"),
      nextButton = document.querySelector(".nextButton"),
      verifyButton = document.querySelector(".verifyButton");

window.addEventListener("load", () => {
    emailjs.init("SWpLEVU1sMdh2Hw-N");
    step2.style.display = "none";
    step3.style.display = "none";
    nextButton.classList.add("disable");
    verifyButton.classList.add("disable");
});

const validateEmail =(email)=>{
    let re=/\S+@\S+\.\S+/;
    if(re.test(email)){
        nextButton.classList.remove("disable");
    } else{
        nextButton.classList.add("disable");
    }
};

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
};
const serviceID = "service_icpijt9";
const templateID = "template_d1snf1p";
nextButton.addEventListener("click",() => {

    let templateParameter={
        from_name: "NothWest_Team",
        OTP: generateOTP(),
        message: "This is for Verification Only" ,
        reply_to : emailAddress.value,
    };
    
    emailjs.send(serviceID, templateID, templateParameter).then(
    (res) => {
        console.log(res);
    },(err) => {
        console.log(err); 
    }
  ); 
});

