import "../assets/emulator/scss/Emulator.scss";
import {
    Button, Col, Container, Row,
} from "react-bootstrap";
import React, {useState} from 'react';
import EmulatorView from "../components/emulator/EmulatorView.jsx";
import {GlobalStyles} from "../assets/emulator/theming/global.js";
import {ThemeProvider} from "styled-components";
import {useDarkMode} from "../hooks/emulator/theming/useDarkMode.js";
import {darkTheme, lightTheme} from "../assets/emulator/theming/theme.js";

function EmulatorPage() {
    const emulatorUrisFromStorage = JSON.parse(sessionStorage.getItem('emulatorUris')) || [];
    const radiosEmulatorView = [{name: 'WebRTC', value: 'webrtc'}, {name: 'PNG', value: 'png'},]
    const [emulatorViewCounter, setEmulatorViewCounter] = useState(2);
    const [emulatorViews, setEmulatorViews] = useState([{
        emulatorConnectionState: {emuState: ""},
        hasEmulatorAudio: {hasAudio: false},
        longitudeValue: 8.72932,
        latitudeValue: 47.4974,
        hasEmulatorError: false,
        emulatorErrorMessage: null,
        gpsLocation: {gps: {latitude: 47.4974, longitude: 8.72932}},
        volumeState: {volume: 0, muted: true},
        radioEmulatorViewValue: 'png',
        emulatorUri: emulatorUrisFromStorage[0] || "https://fmd.localhost:4443/",
        radiosEmulatorView: radiosEmulatorView,
    }, {
        emulatorConnectionState: {emuState: ""},
        hasEmulatorAudio: {hasAudio: false},
        longitudeValue: 8.72932,
        latitudeValue: 47.4974,
        hasEmulatorError: false,
        emulatorErrorMessage: null,
        gpsLocation: {gps: {latitude: 47.4974, longitude: 8.72932}},
        volumeState: {volume: 0, muted: true},
        radioEmulatorViewValue: 'png',
        emulatorUri: emulatorUrisFromStorage[1] || "https://fmd-aosp.init-lab.ch:4443/0",
        radiosEmulatorView: radiosEmulatorView,
    }, {
        emulatorConnectionState: {emuState: ""},
        hasEmulatorAudio: {hasAudio: false},
        longitudeValue: 8.72932,
        latitudeValue: 47.4974,
        hasEmulatorError: false,
        emulatorErrorMessage: null,
        gpsLocation: {gps: {latitude: 47.4974, longitude: 8.72932}},
        volumeState: {volume: 0, muted: true},
        radioEmulatorViewValue: 'png',
        emulatorUri: emulatorUrisFromStorage[1] || "https://fmd-aosp.init-lab.ch:4443/1",
        radiosEmulatorView: radiosEmulatorView,
    }]);
    const [selectedEmulatorViewIndex, setSelectedEmulatorViewIndex] = useState(null);


    const updateEmulatorView = (index, key, value) => {
        setEmulatorViews(prevEmulatorViews => prevEmulatorViews.map((emulatorView, i) => {
            if (i === index) {
                return {...emulatorView, [key]: value};
            } else {
                return emulatorView;
            }
        }));
    };

    const addEmulatorView = () => {
        const newEmulatorView = {
            emulatorConnectionState: {emuState: ""},
            hasEmulatorAudio: {hasAudio: true},
            longitudeValue: 0.0,
            latitudeValue: 0.0,
            hasEmulatorError: false,
            emulatorErrorMessage: null,
            gpsLocation: {gps: {latitude: 0.0, longitude: 0.0}},
            volumeState: {volume: 0, muted: true},
            radioEmulatorViewValue: 'png',
            emulatorUri: "https://fmd-aosp.init-lab.ch:4443/" + emulatorViewCounter,
            radiosEmulatorView: radiosEmulatorView,
        };
        setEmulatorViews(prevEmulatorViews => [...prevEmulatorViews, newEmulatorView]);
        setEmulatorViewCounter(emulatorViewCounter + 1);
    };

    const connectAllEmulators = () => {
        emulatorViews.forEach((emulatorView, index) => {
            updateEmulatorView(index, 'emulatorConnectionState', {emuState: "connecting"});
        });
    };

    const [theme] = useDarkMode();
    const themeMode = theme === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeProvider theme={themeMode}>
            <GlobalStyles/>
            <Container className="container-sm mt-3">
                <h5>Emulator (experimental) </h5>
                <Row className="mt-3 mb-3">
                    <Col xs={12} sm={6} md={4}>
                        {selectedEmulatorViewIndex === null ? (<>
                            <Button
                                className={"mr-3"}
                                variant={"outline-light"}
                                onClick={addEmulatorView}>Add Emulator View
                            </Button>
                            <Button
                                variant={"outline-light"}
                                onClick={connectAllEmulators}>Connect All
                            </Button>
                        </>) : (<a className="mt-3 mb-3"
                                   href="#"
                                   onClick={() => setSelectedEmulatorViewIndex(null)}>Multiple Emulator Views
                        </a>)}
                    </Col>
                </Row>
                <Row>
                    {selectedEmulatorViewIndex !== null ? (<Col className="mt-3 mb-3" xs={10}>
                        <EmulatorView
                            index={selectedEmulatorViewIndex}
                            emulatorConnectionState={emulatorViews[selectedEmulatorViewIndex].emulatorConnectionState}
                            setEmulatorConnectionState={(value) => updateEmulatorView(selectedEmulatorViewIndex, 'emulatorConnectionState', value)}
                            hasEmulatorAudio={emulatorViews[selectedEmulatorViewIndex].hasEmulatorAudio}
                            setHasEmulatorAudio={(value) => updateEmulatorView(selectedEmulatorViewIndex, 'hasEmulatorAudio', value)}
                            longitudeValue={emulatorViews[selectedEmulatorViewIndex].longitudeValue}
                            setLongitudeValue={(value) => updateEmulatorView(selectedEmulatorViewIndex, 'longitudeValue', value)}
                            latitudeValue={emulatorViews[selectedEmulatorViewIndex].latitudeValue}
                            setLatitudeValue={(value) => updateEmulatorView(selectedEmulatorViewIndex, 'latitudeValue', value)}
                            hasEmulatorError={emulatorViews[selectedEmulatorViewIndex].hasEmulatorError}
                            setHasEmulatorError={(value) => updateEmulatorView(selectedEmulatorViewIndex, 'hasEmulatorError', value)}
                            emulatorErrorMessage={emulatorViews[selectedEmulatorViewIndex].emulatorErrorMessage}
                            setEmulatorErrorMessage={(value) => updateEmulatorView(selectedEmulatorViewIndex, 'emulatorErrorMessage', value)}
                            gpsLocation={emulatorViews[selectedEmulatorViewIndex].gpsLocation}
                            setGpsLocation={(value) => updateEmulatorView(selectedEmulatorViewIndex, 'gpsLocation', value)}
                            volumeState={emulatorViews[selectedEmulatorViewIndex].volumeState}
                            setVolumeState={(value) => updateEmulatorView(selectedEmulatorViewIndex, 'volumeState', value)}
                            radioEmulatorViewValue={emulatorViews[selectedEmulatorViewIndex].radioEmulatorViewValue}
                            setRadioEmulatorViewValue={(value) => updateEmulatorView(selectedEmulatorViewIndex, 'radioEmulatorViewValue', value)}
                            emulatorUri={emulatorViews[selectedEmulatorViewIndex].emulatorUri}
                            setEmulatorUri={(value) => updateEmulatorView(selectedEmulatorViewIndex, 'emulatorUri', value)}
                            radiosEmulatorView={emulatorViews[selectedEmulatorViewIndex].radiosEmulatorView}
                            onSelect={() => setSelectedEmulatorViewIndex(selectedEmulatorViewIndex)}
                            selectedEmulatorViewIndex={selectedEmulatorViewIndex}
                        />
                    </Col>) : (emulatorViews.map((emulatorView, index) => (
                        <Col className="mt-3 mb-3" xs={12} sm={6} md={4} key={index}>
                            <EmulatorView
                                index={index}
                                emulatorConnectionState={emulatorView.emulatorConnectionState}
                                setEmulatorConnectionState={(value) => updateEmulatorView(index, 'emulatorConnectionState', value)}
                                hasEmulatorAudio={emulatorView.hasEmulatorAudio}
                                setHasEmulatorAudio={(value) => updateEmulatorView(index, 'hasEmulatorAudio', value)}
                                longitudeValue={emulatorView.longitudeValue}
                                setLongitudeValue={(value) => updateEmulatorView(index, 'longitudeValue', value)}
                                latitudeValue={emulatorView.latitudeValue}
                                setLatitudeValue={(value) => updateEmulatorView(index, 'latitudeValue', value)}
                                hasEmulatorError={emulatorView.hasEmulatorError}
                                setHasEmulatorError={(value) => updateEmulatorView(index, 'hasEmulatorError', value)}
                                emulatorErrorMessage={emulatorView.emulatorErrorMessage}
                                setEmulatorErrorMessage={(value) => updateEmulatorView(index, 'emulatorErrorMessage', value)}
                                gpsLocation={emulatorView.gpsLocation}
                                setGpsLocation={(value) => updateEmulatorView(index, 'gpsLocation', value)}
                                volumeState={emulatorView.volumeState}
                                setVolumeState={(value) => updateEmulatorView(index, 'volumeState', value)}
                                radioEmulatorViewValue={emulatorView.radioEmulatorViewValue}
                                setRadioEmulatorViewValue={(value) => updateEmulatorView(index, 'radioEmulatorViewValue', value)}
                                emulatorUri={emulatorView.emulatorUri}
                                setEmulatorUri={(value) => updateEmulatorView(index, 'emulatorUri', value)}
                                radiosEmulatorView={emulatorView.radiosEmulatorView}
                                onSelect={() => setSelectedEmulatorViewIndex(index)}
                                selectedEmulatorViewIndex={null}
                            />
                        </Col>)))}
                </Row>
            </Container>
        </ThemeProvider>
    );
}

export default EmulatorPage;