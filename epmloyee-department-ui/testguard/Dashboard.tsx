import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import CardStatistic from '../../components/cards/CardStatistic'
import FilterDropdown from '../../components/filters/FilterDropdown'
import Layout from '../../components/layout/Layout'
// import InfoTable from '../../components/tables/InfoTable'
import BaseModal from '../../components/modal/BaseModal'
import SectionTitle from '../../components/titles/SectionTitle'
import CheckInOutModal from '../../components/modal/CheckInOutModal'
import DataTable from '../../components/tables/DataTable'
import { SVGGuardStatus, SVGInDoor, SVGMarker, SVGMoreDots, SVGOutDoor, SVGPlus, SVGReplace } from '../../assets/icons/SvgIcons'
import { forTodayContent, guardsNotOnTimeContent, jobsActiveNowContent } from '../../content/dashboard/TablesContent'
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap'
import {NotificationTypes} from "../../common/interfaces/INotification";
import {IGuardShift} from "../../common/interfaces/guards/IShift";
import ResourceDataService from "../../common/services/ResourceDataService";
import AppContext from "../../context/AppContext";
import moment from "moment";

enum DashboardModals {
    in = "checkIn",
    out = "checkOut",
    absent = "absent"
}

type ModalState = {
    [index: string]: boolean
    checkIn: boolean,
    checkOut: boolean,
    absent: boolean
}

const Dashboard = () => {
    const [showModal, setShowModal] = useState<ModalState>({
        checkIn: false,
        checkOut: false,
        absent: false
    } as ModalState)

    const appContext = useContext(AppContext)
    const [shifts, setShifts] = useState<IGuardShift[]>([] as IGuardShift[])

    useEffect(() => {
        getShift()
    }, [])


    const openModal = (e: React.MouseEvent<any> | null, type: DashboardModals) => {
        e !== null && e.preventDefault();

        const modals = {...showModal};

        for (let [key, ] of Object.entries(modals)) {
            key === type ? (modals[type] = true) : (modals[key] = false);
        }

        setShowModal(modals)
    }

    const onCancelModal = () => {
        setShowModal({
            absent: false,
            checkIn: false,
            checkOut: false
        })
    }

    const onSubmitModal = () => {
        onCancelModal()
        alert('Submit click!')
    }

    const getShift = async () => {
        const shiftsSvc = new ResourceDataService<IGuardShift[]>({ url: 'shift/assigned' })
        try {
            const res = await shiftsSvc.getAll();
            const filterData = res.data.filter((x) => new Date(x.startDate).getDate() == new Date().getDate());
            setShifts(filterData);
        } catch (e) {
            appContext.showNotification(NotificationTypes.danger, e.message)
        }
    }

    return (
        <Layout>
            <BaseModal
                show={showModal.checkIn || showModal.checkOut || showModal.absent}
                title={showModal.checkIn ? "Check In" : ( showModal.absent ? "Absent" : "Check Out")}
                onSubmit={() => onSubmitModal()}
                onCancel={() => onCancelModal()}
                submitBtnText={showModal.checkIn ? "Check In" : ( showModal.absent ? "Absent" : "Check Out")}
            >
                <CheckInOutModal
                    type={showModal.checkIn ? "checkin" : ( showModal.absent ? "absent" : "checkout")}
                />
            </BaseModal>

            <section>
                <div className="row">
                    <div className="col-12 py-4">
                        <SectionTitle title="Jobs Active Right Now: [Morning Shift]"/>
                    </div>
                    <div className="col-12 d-flex flex-row align-items-center justify-content-between">
                        <form className="d-flex flex-row">
                            <FilterDropdown
                                className="mr-2"
                                defaultLabel="View All Zones"
                                options={[
                                    {
                                        label: "Notrh",
                                        value: 'north'
                                    },
                                    {
                                        label: "West",
                                        value: 'west'
                                    }
                                ]}
                                onSelect={val => console.log(val)}
                            />
                            <FilterDropdown
                                className="mr-2"
                                defaultLabel="Select School Board"
                                options={[
                                    {
                                        label: "SchoolBoard 1",
                                        value: 'schoolBoard_1'
                                    },
                                    {
                                        label: "SchoolBoard 2",
                                        value: 'schoolBoard_2'
                                    }
                                ]}
                                onSelect={val => console.log(val)}
                            />
                            <FilterDropdown
                                defaultLabel="Shift Period"
                                className="mr-2"
                                options={[
                                    {
                                        label: "Morning",
                                        value: 'morning'
                                    },
                                    {
                                        label: "Afternoon",
                                        value: 'afternoon'
                                    }
                                ]}
                                onSelect={val => console.log(val)}
                            />
                            <button className="btn btn-aqua-blue" type="submit">Filter Jobs</button>
                        </form>

                        <form className="d-flex flex-row">
                            <input type="text" className="form-control mr-2" placeholder="Enter Keyword"/>
                            <button className="btn btn-aqua-blue" type="submit">Search</button>
                        </form>

                    </div>

                    <div className="col-12 pt-4">
                        <DataTable
                            thead={jobsActiveNowContent.thead}
                            tbody={jobsActiveNowContent.tbody}
                            tableClass={'table-info--notFixed'}
                        >
                            {
                                (indx) => (
                                    <>
                                        <td className="align-middle">
                                            <div>
                                                <div>
                                                    <SVGGuardStatus />
                                                </div>

                                                    <div className="d-flex flex-column">
                                                        <OverlayTrigger
                                                            key={indx}
                                                            placement={'top'}
                                                            overlay={
                                                                <Tooltip className="table-info__tooltip" id={`tooltip-${indx}-in`}>
                                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <span>
                                                            <SVGInDoor />
                                                            </span>
                                                        </OverlayTrigger>

                                                        <OverlayTrigger
                                                            key={indx}
                                                            placement={'top'}
                                                            overlay={
                                                                <Tooltip className="table-info__tooltip" id={`tooltip-${indx}-out`}>
                                                                    A set of components for positioning beautiful overlays, tooltips, popovers, and anything else you need.
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <span>
                                                                <SVGOutDoor />
                                                            </span>
                                                        </OverlayTrigger>
                                                    </div>

                                            </div>
                                        </td>
                                        <td className="align-middle">
                                            <div>
                                                <span className="d-flex align-items-center justify-content-center table-info__counter table-info__counter--best">
                                                    0
                                                </span>
                                            </div>
                                        </td>
                                        <td className="align-middle">
                                            <div className="d-flex justify-content-between">
                                                <button className="btn btn-aqua-blue">
                                                    <SVGReplace />
                                                </button>
                                                <button className="btn btn-aqua-blue">
                                                    <SVGMarker />
                                                </button>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="aqua-blue" id={`dropdown-action-${indx}`}>
                                                        <SVGMoreDots />
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1" onClick={e => openModal(e, DashboardModals.in)}>Check In</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2" onClick={e => openModal(e, DashboardModals.absent)}>Mark Absent</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3" onClick={e => openModal(e, DashboardModals.out)}>Check Out</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </td>
                                    </>
                                )
                            }

                        </DataTable>
                    </div>

                </div>
            </section>

            <section>
                <div className="row">
                    <div className="col-12 py-4">
                        <SectionTitle title="Today's Guard Attendance: [Morning Shift]"/>
                    </div>
                    <div className="col-md-6">
                        <CardStatistic
                            title="Total Number of Guards"
                            value="125"
                        />
                    </div>
                    <div className="col-md-6">
                        <CardStatistic
                            title="Guard Attendance"
                            value="98.2%"
                        />
                    </div>
                </div>
            </section>

            <section>
                <div className="row">
                    <div className="col-12 pt-4">
                        <SectionTitle title="For Today"/>
                    </div>
                    <div className="col-12 d-flex flex-row justify-content-between py-4">
                        <h5>Shifts That Require a Guard to be Assigned</h5>
                        <Link className="font-weight-bold text-primary" to="/activity/recent">See all</Link>
                    </div>
                    <div className="col-12">
                        <DataTable
                            thead={forTodayContent.thead}
                            tbody={shifts ?
                                shifts.map((item) => ({
                                    id: item.id,
                                    jobName: item.jobName,
                                    date: item.startDate,
                                    holiday: "Public School P.A. Day",
                                    times: `${moment(item.timeFrom,).format("hh:mm A")} - ${moment(item.timeTo).format("hh:mm A")}`,
                                    shiftPeriod: item.startDate,
                                })): []}
                            ignoreCols={[0]}
                        >
                            {
                                () => (
                                    <td className="align-middle">
                                        <button className="btn btn-aqua-blue">
                                            <SVGPlus />
                                        </button>
                                    </td>
                                )
                            }
                        </DataTable>
                    </div>
                </div>
            </section>
            <section>
                <div className="row">
                    <div className="col-12 d-flex flex-row justify-content-between py-4">
                        <SectionTitle title="Guards Not On Time or Absent"/>
                        <Link className="font-weight-bold text-primary" to="/activity/recent">See all</Link>
                    </div>
                    <div className="col-12">
                        <DataTable
                            thead={guardsNotOnTimeContent.thead}
                            tbody={guardsNotOnTimeContent.tbody}
                        />
                    </div>
                </div>
            </section>

            {/* <section>
                <div className="row">
                    <div className="col-md-6">
                        <div className="d-flex flex-row justify-content-between py-4">
                            <SectionTitle title="Request to Deactivate Users"/>
                            <Link className="font-weight-bold text-primary" to="/activity/recent">See all</Link>
                        </div>
                        <DataTable
                            thead={deactivateUsersContent.thead}
                            tbody={deactivateUsersContent.tbody}
                        >
                            {
                            () => <td className="align-middle">
                                    <button className="btn btn-aqua-blue px-2 mr-2">
                                        <SVGApprove />
                                    </button>
                                    <button className="btn btn-aqua-blue px-2">
                                        <SVGCancel />
                                    </button>
                                </td>
                            }
                        </DataTable>
                    </div>

                    <div className="col-md-6">
                        <div className="d-flex flex-row justify-content-between py-4">
                            <SectionTitle title="Request to Deactivate Jobs"/>
                            <Link className="font-weight-bold text-primary" to="/activity/recent">See all</Link>
                        </div>
                        <DataTable
                            thead={deactivateJobsContent.thead}
                            tbody={deactivateJobsContent.tbody}
                        >
                            {
                            () => <td className="align-middle">
                                    <button className="btn btn-aqua-blue px-2 mr-2">
                                        <SVGApprove />
                                    </button>
                                    <button className="btn btn-aqua-blue px-2">
                                        <SVGCancel />
                                    </button>
                                </td>
                            }
                        </DataTable>
                    </div>
                </div>
            </section> */}

            {/* <section>
                <div className="row">
                    <div className="col-12 d-flex flex-row justify-content-between py-4">
                        <SectionTitle title="Your Recent Activity"/>
                        <Link className="font-weight-bold text-primary" to="/activity/recent">See all</Link>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <InfoTable
                            tbody={[
                                {
                                    time: '9:32AM',
                                    date: 'August 2, 2020',
                                    text: 'Added Client Joe Perry'
                                },
                                {
                                    time: '4:32AM',
                                    date: 'August 2, 2020',
                                    text: 'Added Client Joe Perry'
                                }
                            ]}
                        />
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <InfoTable
                            tbody={[
                                {
                                    time: '9:32AM',
                                    date: 'August 2, 2020',
                                    text: 'Added Client Joe Perry'
                                },
                                {
                                    time: '4:32AM',
                                    date: 'August 2, 2020',
                                    text: 'Added Client Joe Perry'
                                }
                            ]}
                        />
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <InfoTable
                            tbody={[
                                {
                                    time: '9:32AM',
                                    date: 'August 2, 2020',
                                    text: 'Added Client Joe Perry'
                                },
                                {
                                    time: '4:32AM',
                                    date: 'August 2, 2020',
                                    text: 'Added Client Joe Perry'
                                }
                            ]}
                        />
                    </div>
                </div>
            </section> */}

        </Layout>
    )
}

export default Dashboard
