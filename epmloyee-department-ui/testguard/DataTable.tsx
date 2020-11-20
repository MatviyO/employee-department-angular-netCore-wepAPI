import React, { FC, ReactNode, useEffect, useState } from 'react'
import { SVGArrowDown, SVGArrowUp, SVGTableLoader } from '../../assets/icons/SvgIcons'
import { useSortableData } from '../../customHooks/useSortableData'
import CustomSelectControl from '../custom-select/CustomSelectControl'
import moment from 'moment/moment.js'

export type TheadData = {
    [index: string]: string | boolean | undefined
    label: string
    sortable?: boolean
    dataType?: string
    direction?: string
}

type Props = {
    tbody: Array<any>
    isLoading?: boolean
    thead?: Array<TheadData>
    children?: (indx: number) => ReactNode
    tableClass?: string
    theadClass?: string
    tbodyClass?: string
    ignoreCols?: number[] // Start from 0
    onColClick?: (key: string, trIndx?: number) => void
    pagination?: boolean
    onPager?: (currPage: number) => void
    onPerPage?: (value: string) => void
    currentPage?: number
    itemsCount?: number
    itemsPerPage?: number
}

const perPageOptions = [
    {
        id: "10", name: "10"
    },
    {
        id: "25", name: "25"
    },
    {
        id: "50", name: "50"
    }
]

const DataTable: FC<Props> = ({
    thead, tbody, children, tableClass, ignoreCols, onColClick, pagination, onPager, currentPage,
    itemsCount, itemsPerPage, onPerPage, isLoading
    }) => {
    const { items, requestSort, headItems } = useSortableData(tbody, null, thead);

    const [pagesList, setPagesList] = useState<number[]>([])

    useEffect(() => {
        const pagesNum = Math.ceil((itemsCount as number)/(itemsPerPage as number))
        let pages = []
        for (let i=1; i <=pagesNum; i++) {
            pages.push(i)
        }
        setPagesList(pages)
    }, [itemsCount, itemsPerPage])

    const setArrow = (statement: string | undefined | null) => {
        switch (statement) {
            case "asc":
                return <SVGArrowUp className="d-flex align-self-start" />
            case "desc":
                return <SVGArrowDown className="d-flex align-self-start"/>
            default:
                return <SVGArrowDown className="d-flex align-self-start"/>
        }
    }

    const checkDataType = (data: any, fieldName: string) => {
        if (data === null || data === undefined) {
            return ""
        }
        if (isNaN(+data) && !data.toString().includes(';') && !data.toString().includes(',') && moment(data).isValid()) {
            if (fieldName === "timeTo" || fieldName === "timeFrom") {
                // return moment(data)..format("hh:mm A").toString()
                return moment.utc(data).local().format("hh:mm A").toString()
            } else {
                return moment(data).format("MMM DD, Y").toString()
            }
        }
        return data;
    }

    return (
        <div className="table-lg-responsive table-wrapper">
            <table className={`table table-info ${tableClass ? tableClass : ""}`}>
                {
                    headItems &&
                    <thead>
                        <tr>
                            { headItems.map((th, indx) =>
                                <th
                                    className="text-center"
                                    style={th.sortable ? {cursor: "pointer"} : {}}
                                    key={th.label}
                                    onClick={() => requestSort(indx)}
                                >
                                    <div>
                                        {
                                            th.sortable &&
                                            <div className="d-flex flex-column align-items-start mr-1">
                                                { setArrow(th.direction) }
                                            </div>
                                        }
                                        <span dangerouslySetInnerHTML={{__html: th.label }} />
                                    </div>
                                </th>
                            ) }
                        </tr>
                    </thead>
                }
                <tbody>
                    {
                        isLoading ?
                            <tr className="text-center">
                                <td colSpan={headItems?.length}>
                                    <div className="py-4">
                                        <SVGTableLoader className="table-info-loader"/>
                                    </div>
                                </td>
                            </tr>
                        :

                        (items.length !== 0 && !isLoading) ? items.map((tr, trIndx) =>
                            <tr className={`text-center row-id-${items[trIndx].id}`} key={trIndx}>
                                { Object.entries(tr).map(([key, value], tdIndx) =>
                                    ignoreCols ?
                                    (!ignoreCols.includes(tdIndx) && 
                                        <td className={`align-middle ${key.includes('Link') ? 'isLink' : ''}`} key={tr.index} onClick={() => onColClick && onColClick(key, items[trIndx].id)} >
                                            <div>
                                                { checkDataType(value as any, key) }
                                            </div>
                                        </td>) :
                                        <td className={`align-middle ${key.includes('Link') ? 'isLink' : ''}`} key={tr.index} onClick={() => onColClick && onColClick(key, items[trIndx].id)}>
                                            <div>
                                                { checkDataType(value as any, key) }
                                            </div>
                                        </td>
                                )}
                                { children && children(items[trIndx].id) }
                            </tr>) :
                            <tr className="text-center">
                                <td colSpan={headItems?.length}>
                                    <div className="py-4">
                                        No data found.
                                    </div>
                                </td>
                            </tr>
                    }

                </tbody>
            </table>
            {/* Start Per Page */}

            {/* Start Pagination */}
            {
                ((tbody.length !== 0 && (itemsCount as number) > (itemsPerPage as number)) && pagination) &&
                <div className="table-info__pagination pt-3 pb-2 d-flex justify-content-end align-items-center">
                {
                    currentPage !== 1 &&
                    <React.Fragment>
                    <button type="button" className="btn btn-outline-aqua-blue px-2 mr-auto" onClick={() => onPager && onPager((currentPage as number) - 1)}>
                        Previous
                    </button>{' '}
                    {/* <button type="button" className="btn btn-transparent px-1" onClick={() => onPager && onPager(1)}>
                        {1}
                    </button>{' '} */}
                    </React.Fragment>
                }

                <ul className="table-info__pages list-unstyled mb-0 d-flex flex-row">
                    {
                        pagesList.map(page => 
                            <li 
                            key={page} 
                            className={`${currentPage === page ? "current" : ''}`}
                            onClick={() => onPager && onPager(page)}
                            >{ page }</li>
                        )
                    }
                </ul>

                {
                    tbody.length !== 0 && onPerPage && (itemsPerPage !== undefined) &&
                    <div className="table-info__perPage w-25 d-flex flex-row align-items-center justify-content-end">
                        <label className="mr-2 mb-0">Items per page</label>
                        <CustomSelectControl
                            className="flex-shrink-0"
                            value={itemsPerPage.toString()}
                            options={perPageOptions}
                            onChange={value => onPerPage(value)}
                        />
                    </div>
                }
                {
                    currentPage !== Math.ceil((itemsCount as number)/(itemsPerPage as number)) &&
                     Math.ceil((itemsCount as number)/(itemsPerPage as number)) > 1 &&
                    <React.Fragment>
                    <button type="button" className="btn btn-aqua-blue px-2 ml-5" onClick={() => onPager && onPager((currentPage as number) + 1)}>
                        Next
                    </button>{' '}
                    </React.Fragment>
                }
                </div>
            }
        </div>
    )
}

export default DataTable
