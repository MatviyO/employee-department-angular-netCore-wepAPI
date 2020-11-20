import { LoadScript, GoogleMap, Marker, Circle } from '@react-google-maps/api'
import React, { FC } from 'react'

const circleOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1
}

type Props = {
    lat: number
    lng: number
    radius: number
    locataionFirst?: any
    locataionSecond?: any
}

const GeofenceMap: FC<Props> = ({lat, lng, radius, locataionFirst, locataionSecond}) => {
    console.log(locataionFirst, 'locataionFirst');
    console.log(locataionSecond, ' locataionSecond')
    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP_KEY as string}>
            <GoogleMap
                zoom={14}
                center={{ lat: locataionFirst.lat, lng: locataionFirst.lng }}
                options={{
                    streetViewControl: false
                }}
                id="job-location-map"
            >
                <Marker position={{ lat: locataionFirst.lat, lng: locataionFirst.lng }} />
                {
                    locataionSecond &&
                        <>
                            <Marker position={{ lat: locataionSecond.lat, lng: locataionSecond.lng }}/>
                            <Circle
                                radius={radius}
                                center={{ lat: locataionSecond.lat, lng: locataionSecond.lng  }}
                                options={circleOptions}/>
                        </>
                }
                <Circle
                    radius={radius}
                    center={{ lat: locataionFirst.lat, lng: locataionFirst.lng  }}
                    options={circleOptions}
                />
            </GoogleMap>
            {/*<GoogleMap*/}
            {/*    zoom={15}*/}
            {/*    center={{ lat, lng }}*/}
            {/*    options={{*/}
            {/*        streetViewControl: false*/}
            {/*    }}*/}
            {/*    id="job-location-map"*/}
            {/*>*/}
            {/*    <Marker position={{ lat, lng }} />*/}
            {/*    <Circle*/}
            {/*            radius={radius}*/}
            {/*            center={{ lat, lng }}*/}
            {/*            options={circleOptions}*/}
            {/*        />*/}
            {/*</GoogleMap>*/}
        </LoadScript>
    )
}

export default GeofenceMap
