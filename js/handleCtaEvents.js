//Shared resource

let atfCtas = document.querySelectorAll('.atf-cta');
let btfCtas = document.querySelectorAll('.btf-cta');
let stepCtas = document.querySelectorAll('.cta-steps');

atfCtas.forEach((atfCta, index) => {
    atfCta.addEventListener('click', () => handleAtfClick(index + 1));
});

btfCtas.forEach((btfCta, index) => {
    btfCta.addEventListener('click', () => handleBtfClick(index + 1));
});

stepCtas.forEach((stepCta, index) => {
    stepCta.addEventListener('click', () => handleStepCtaClick(index + 1));
});

function handleAtfClick(buttonNumber) {
    let customAttributes = {};
    customAttributes['event_action'] = `AtfBtn${buttonNumber}`;
    mixpanelTrack('CtaClick', customAttributes);
    gtmTrack('install_click');
}

function handleBtfClick(buttonNumber) {
    let customAttributes = {};
    customAttributes['event_action'] = `BtfBtn${buttonNumber}`;
    mixpanelTrack('CtaClick', customAttributes);
    gtmTrack('install_click');
}

function handleStepCtaClick(buttonNumber) {
    let customAttributes = {};
    customAttributes['event_action'] = `StepCta${buttonNumber}`;
    mixpanelTrack('CtaClick', customAttributes);
    gtmTrack('install_click');
}