import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import Footer from '@/components/footer';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    type ChartData,
    type ChartOptions
} from 'chart.js';

import { Chart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
);



const analytics = {
    views: [
        { "January": 0 },
        { "February": 3 },
        { "March": 100 },
        { "April": 103 },
        { "May": 125 },
        { "June": 143 },
        { "July": 203 }
    ],
    sales: 234,
    pendingSales: 344,
    income: 4680
}

const labels = analytics.views.map(item => Object.keys(item)[0]);
const values = analytics.views.map(item => Object.values(item)[0]);

const data: ChartData<'bar', number[], string> = {
    labels,
    datasets: [
        {
            type: 'bar',
            label: 'Views',
            data: values,
            backgroundColor: 'black',
            borderRadius: 4
        }
    ]
};

const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
        }
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
};





const VendorExample = {
    storeName: "Store Example",
    storeImage: "https://cdn2.picryl.com/photo/2017/10/16/the-econo-grocery-store-is-fully-stocked-with-food-85b675-1024.jpg",
    isActive: true
};





const VendorHomePage = () => {
    const total = analytics.sales + analytics.pendingSales;
    const firstPercent = (analytics.sales / total) * 100;
    const secondPercent = (analytics.pendingSales / total) * 100;
    return (
        <>
            <Header page="vendor-home"/>
            <main className="flex-grow  container mx-auto px-4 py-8 md:py-12 mt-16">
                <div className="flex gap-6 justify-center items-center">
                    <div className="w-[70%]  bg-white rounded-lg  overflow-hidden flex flex-col gap-6">
                        <div className="flex flex-col gap-4 w-full p-4 h-[60vh]">
                            <h1 className="text-xl font-semibold">Monthly Viewers</h1>
                            <Chart type="bar" data={data} options={options} className="w-full h-full" />

                        </div>

                        <div className="flex gap-6">
                            <div className="flex-1 bg-gray-50 p-4 rounded text-center flex gap-3 items-center flex-col justify-center">
                                <h2 className="text-lg font-semibold text-center">Gross Income</h2>
                                <p className="w-30 h-30 bg-black rounded-full text-center text-white font-bold  text-l flex items-center justify-center">{new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2
                                }).format(analytics.income)}</p>
                            </div>

                            <div className="flex-1 p-4 rounded bg-gray-50 flex flex-col ">
                                <h2 className="text-lg font-semibold text-center mb-2">Products Still in Cart</h2>
                                <div className="flex justify-between font-semibold text-l text-black mt-2">
                                    <span>{analytics.sales}</span>
                                    <span>{analytics.pendingSales}</span>
                                </div>
                                <div className="w-full h-6 rounded overflow-hidden flex bg-gray-200 ">
                                    <div className="bg-black" style={{ width: `${firstPercent}%` }} />
                                    <div className="bg-gray-400" style={{ width: `${secondPercent}%` }} />
                                </div>
                                <div className="flex justify-between text-m text-black mt-2">
                                    <span>Sales</span>
                                    <span>Products in Cart</span>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="w-[25%] h-[50%] bg-white rounded-lg border border-gray-300 overflow-hidden p-4 md:p-8 flex flex-col ">
                        <img src={VendorExample.storeImage} alt={"Store Image"} className="w-full object-cover" />
                        <h2 className='font-semibold py-2'>{VendorExample.storeName}</h2>
                        <Button className="w-full md:w-auto">View Products in Store</Button>

                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default VendorHomePage;
