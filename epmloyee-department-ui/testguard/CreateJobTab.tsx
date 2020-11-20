import moment from 'moment'
import React, { FC, useContext, useState } from 'react'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ICityDropdown } from '../../../common/interfaces/dropdowns/ICityDropdown'
import { IClientContactsDropdown } from '../../../common/interfaces/dropdowns/IClientContactsDropdown'
import { IClientDropdown } from '../../../common/interfaces/dropdowns/IClientDropDown'
import { ISchoolYearDropdown } from '../../../common/interfaces/dropdowns/ISchoolYearDropdown'
import { IZoneDropdown } from '../../../common/interfaces/dropdowns/IZoneDropdown'
import JobContext from '../../../context/jobs/JobContext'
import WizardFormContext from '../../../context/jobs/WizardFormContext'
import CustomSelectControl from '../../custom-select/CustomSelectControl'
import ScheduleForm from '../../schedule/ScheduleForm'
import SectionTitle from '../../titles/SectionTitle'
import GeofenceMap from "../GeofenceMap";

type Props = {
    clients: IClientDropdown[]
    cities: ICityDropdown[]
}

const CreateJobTab: FC<Props> = ({ clients, cities }) => {
    const [clientContactOpts, setClientContactOpts] = useState<IClientContactsDropdown[]>([] as IClientContactsDropdown[]);
    const [schoolYeartOpts, setSchoolYeartOpts] = useState<ISchoolYearDropdown[]>([] as ISchoolYearDropdown[]);
    const [zoneOpts, setZoneOpts] = useState<IZoneDropdown[]>([] as IZoneDropdown[]);
    const [locataionFirst, setLocationFirst] = useState();
    const [locataionSecond, setLocationSecond] = useState();
    const history = useHistory();
    const { stepHandler } = useContext(WizardFormContext)

    const { job, onChange, onScheduleChanged, onScheduleSubmit, onGetJobLocation } = useContext(JobContext)

    useEffect(() => {
        const client = clients.find(client => client.id === job.clientId)

        if (client && (client.schoolYears.length !== 0 && client.clientContacts.length !== 0)) {
            setSchoolYeartOpts(client.schoolYears)
            setClientContactOpts(client.clientContacts)
        } else {
            setSchoolYeartOpts([])
            setClientContactOpts([])
            onChange([
                { value: null, name: "schoolYearId" },
                { value: null, name: "clientContactId" },
            ])
        }
    }, [job.clientId])

    useEffect(() => {
        const city = cities.find(city => city.id === job.cityId)

        if (city && city.zoneViewModels.length !== 0) {
            setZoneOpts(city.zoneViewModels)
        } else {
            setZoneOpts([])
            onChange("null", "zoneId")
        }
    }, [job.cityId])

    const getLocationFirstStreet = async () => {
        if (job.firstStreet.length > 3) {
            let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${job.firstStreet}&key=${process.env.REACT_APP_MAP_KEY}`;
            let response = await fetch(url);
            let data = await response.json();
            console.log("DATA--getLocationFirstStreet:",data)
            if (data.results[0].geometry.location) {
                setLocationFirst(data.results[0].geometry.location)
            }

        }
    }
    const getLocationSecondStreet = async () => {
        if (job.secondStreet.length > 3) {
            let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${job.secondStreet}&key=${process.env.REACT_APP_MAP_KEY}`;
            let response = await fetch(url);
            let data = await response.json();
            console.log("DATA--getLocationSecondStreet:",data)
            if (data.results[0].geometry.location) {
                setLocationSecond(data.results[0].geometry.location)
            }
            setTimeout(() =>  {
                getMapsApi2();
            })
        }
    }
    const getMapsApi2 = async () => {
        if (locataionFirst && locataionSecond) {
            // @ts-ignore
            let url = `https://roads.googleapis.com/v1/snapToRoads?path=${locataionFirst.lat},${locataionFirst.lng}|${locataionSecond.lat},${locataionSecond.lng}|&interpolate=true&key=${process.env.REACT_APP_MAP_KEY}`;
            let response = await fetch(url);
            let data = await response.json();
            console.log(data)
        }
    }

    return (
        <>
            <div className="col-12">
                <SectionTitle className="pb-4" title="Add a Job" />
            </div>
            <div className="col-md-6 form-group">
                <label>Client</label>
                <CustomSelectControl
                    options={clients.map(client => (
                        {
                            id: client.id,
                            name: client.name
                        }
                    ))}
                    onChange={val => onChange(val, "clientId")}
                    value={job.clientId}
                    placeholder={"Select a Client"}
                    className={`custom-react-select--clientId`}
                />
            </div>
            <div className="col-md-6 form-group">
                <label>Client Contact</label>
                <CustomSelectControl
                    options={clientContactOpts}
                    onChange={val => onChange(val, "clientContactId")}
                    value={job.clientContactId}
                    placeholder={"Select a Client"}
                    className={`custom-react-select--clientContactId`}
                />
            </div>

            <div className="col-md-6 form-group">
                <label htmlFor="firstStreet">Street 1 Name or Location Name*</label>
                <input type="text" name="firstStreet" className="form-control" id="firstStreet" placeholder="Enter primary street name" autoComplete="off"
                    value={job.firstStreet}
                    onChange={e => {
                        onChange(e)
                        setTimeout(() => {
                            getLocationFirstStreet();
                        })
                    }}
                />
            </div>
            <div className="col-md-6 form-group">
                <label htmlFor="secondStreet">Street 2 Name</label>
                <input type="text" name="secondStreet" className="form-control" id="secondStreet" placeholder="Enter primary street name" autoComplete="off"
                    value={job.secondStreet}
                    onChange={e => {
                        onChange(e)
                        setTimeout(() => {
                            getLocationSecondStreet();
                        })
                    }}
                />
            </div>

            { locataionFirst && <div className="col-md-12">
                <GeofenceMap
                    // lat={job.latitude !== null ? +job.latitude : 0}
                    // lng={job.longititude !== null ? +job.longititude : 0}
                    lat={0}
                    lng={0}
                    locataionFirst={locataionFirst}
                    locataionSecond={locataionSecond}
                    radius={job.geoFence as number}
                />
            </div>}

            <div className="col-12">
                <button type="button" className="btn btn-transparent text-aqua-blue p-0" onClick={() => onGetJobLocation()}>
                    GET LOCATION COORDINATES
                </button>
            </div>

            <div className="col-md-6 form-group">
            <label htmlFor="latitude">Location Latitude*</label>
                <input type="text" name="latitude" className="form-control" id="latitude" placeholder="Enter secondary street name" autoComplete="off"
                    value={job.latitude || ""}
                    onChange={e => onChange(e)}
                />
            </div>

            <div className="col-md-6 form-group">
                <label htmlFor="longititude">Location Longitude*</label>
                <input type="text" name="longititude" className="form-control" id="longititude" placeholder="Enter primary street name" autoComplete="off"
                   value={job.longititude || ""}
                   onChange={e => onChange(e)}
                />
            </div>

            <div className="col-md-6 form-group">
            <label>Select a City</label>
                <CustomSelectControl
                    options={cities || []}
                    onChange={value => onChange(value, "cityId")}
                    value={job.cityId}
                    placeholder={"Select a City"}
                    className={`custom-react-select--cityId`}
                />
            </div>

            <div className="col-md-6 form-group">
                <label htmlFor="jobId">Job ID*</label>
                <input type="text" name="jobId" className="form-control" id="jobId" placeholder="XXXXXXX" autoComplete="off"
                    value={job.jobId}
                    onChange={e => onChange(e)}
                />
            </div>

            <div className="col-md-6 form-group">
                <label>Select a Zone ID*</label>
                <CustomSelectControl
                    options={zoneOpts}
                    onChange={val => onChange(val, "zoneId")}
                    value={job.zoneId}
                    placeholder={"Select a Zone"}
                    className={`custom-react-select--zoneId`}
                />
            </div>

            {
                job.clientId &&
                <div className="col-md-6 form-group">
                    <label>School year</label>
                    <CustomSelectControl
                        options={schoolYeartOpts.map(year => ({
                            id: year.id,
                            name: `${moment(year.startDate).format('MMMM DD Y')} - ${moment(year.endDate).format('MMMM DD Y')}`
                        }))}
                        onChange={(value, label) => onChange([
                            {value, name: "schoolYearId"},
                            {value: (label as string).split('-').pop(), name: "schoolYearDate"}
                        ])}
                        value={job.schoolYearId}
                        placeholder={"Select a School Year"}
                        className={`custom-react-select--schoolYearId`}
                    />
                </div>
            }

            <div className="col-12">
             <SectionTitle className="py-4" title="Set Job Schedule" />
                {
                    job.jobSchedules && job.jobSchedules.map(item =>
                        <ScheduleForm
                            key={item.uid ? item.uid : item.id}
                            onChange={(event, fieldName) => onScheduleChanged(event, fieldName, item.uid ? item.uid : item.id)}
                            data={item}
                            showShiftPeriod={true}
                        />
                    )
                }
                    <button
                        type="button"
                        className="btn btn-transparent text-aqua-blue px-0 d-block ml-auto"
                        onClick={() => onScheduleSubmit()}>
                            Add another schedule for job
                    </button>
            </div>

            <div className="col-12 d-flex justify-content-lg-between mt-4">
                <button type="button" className="btn btn-outline-aqua-blue px-4" onClick={() => history.push('/jobs')}>
                    Cancel
                </button>
                <button type="button" className="btn btn-aqua-blue px-4" onClick={() => stepHandler(true)}>
                    Next
                </button>
            </div>
        </>
    )
}

export default CreateJobTab
