import React, { useEffect, useState } from 'react';
import SecondaryHeader from '../utility/secondary-header';
import { rolesList } from '../utility/constants';
import { getDashboardDataUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';
import "./dashboard.scss";
import Loader from '../utility/loader';

const DashboardComponent = (props) => {
    const role = localStorage.getItem('roles');

    const [loaderFlag, setLoaderFlag] = useState(false);
    const [dashboardData, setDashboardData] = useState({});

    useEffect(() => {
        getUsersList();
    }, [])

    const getUsersList = () => {
        const params = {};
        if (role === rolesList.SUPERADMIN) {
            params.allData = true;
        } else if (role === rolesList.ADMIN) {
            params.agencyId = localStorage.getItem('agencyId');
        }
        setLoaderFlag(true);
        const config = {
            method: "get",
            url: getDashboardDataUrl,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            params: params
        }
        axios(config).then((resp) => {
            setDashboardData(resp?.data?.data?.[0])
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.message);
        }).finally(() => {
            setLoaderFlag(false);
        })
    }
    return (
        <div className="dashboard-container px-5 py-4 h-100 w-100">
            <SecondaryHeader title="Dashboard" />
            <div className="cards-container d-flex flex-row flex-wrap gap-3">
                {loaderFlag ? <Loader />
                    :
                    Object.keys(dashboardData)?.length > 0 ?
                        Object.entries(dashboardData)?.map(([key, val]) => ({ key, val: val?.[0]?.count }))?.map((item, index) => {
                            const itemName = item?.key?.replace("Count", "");
                            return <div key={index} className='card w-25'>
                                <h1 className='card-title'>{item?.val || 0}</h1>
                                <h4>{itemName?.charAt(0).toUpperCase() + itemName?.slice(1)}s</h4>
                            </div>
                        })
                        : <h4 className='w-100 text-center mt-5'>No Data Available</h4>
                }

            </div>
        </div>
    )
}

export default DashboardComponent;