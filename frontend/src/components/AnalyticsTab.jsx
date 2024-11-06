import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Custom tooltip component to display data when hovering over points
const CustomTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-gray-800 p-4 border border-gray-700 rounded-lg">
				{/* Format and display the date */}
				<p className="text-gray-300 mb-2">
					{new Date(label).toLocaleDateString('en-US', { 
						month: 'long', 
						day: 'numeric' 
					})}
				</p>
				{/* Map through each data point (sales and revenue) */}
				{payload.map((entry) => (
					<p 
						key={entry.name}
						style={{ color: entry.stroke }}
						className="font-semibold"
					>
						{/* Display value with '$' prefix for Revenue */}
						{entry.name}: {entry.name === 'Revenue' ? `$${entry.value}` : entry.value}
					</p>
				))}
			</div>
		);
	}
	return null;
};

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");
				setAnalyticsData(response.data.analyticsData);
				setDailySalesData(response.data.dailySalesData);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				<AnalyticsCard
					title='Total Users'
					value={analyticsData.users.toLocaleString()}
					icon={Users}
					color='from-emerald-500 to-teal-700'
				/>
				<AnalyticsCard
					title='Total Products'
					value={analyticsData.products.toLocaleString()}
					icon={Package}
					color='from-emerald-500 to-green-700'
				/>
				<AnalyticsCard
					title='Total Sales'
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
					color='from-emerald-500 to-cyan-700'
				/>
				<AnalyticsCard
					title='Total Revenue'
					value={`$${analyticsData.totalRevenue.toLocaleString()}`}
					icon={DollarSign}
					color='from-emerald-500 to-lime-700'
				/>
			</div>
			<motion.div
				className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.25 }}
			>
				<ResponsiveContainer width='100%' height={400}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='3 3' stroke="#374151" />
						
						{/* X-Axis configuration */}
						<XAxis 
							dataKey='date' 
							stroke='#D1D5DB'
							tick={{ fill: '#D1D5DB' }}
							// Format date labels to be more readable
							tickFormatter={(date) => {
								const d = new Date(date);
								return d.toLocaleDateString('en-US', { 
									month: 'short', 
									day: 'numeric' 
								});
							}}
						/>
						
						{/* Left Y-Axis for Sales */}
						<YAxis 
							yAxisId='left' 
							stroke='#D1D5DB'
							tick={{ fill: '#D1D5DB' }}
						/>
						
						{/* Right Y-Axis for Revenue with currency formatting */}
						<YAxis 
							yAxisId='right' 
							orientation='right' 
							stroke='#D1D5DB'
							tick={{ fill: '#D1D5DB' }}
							tickFormatter={(value) => `$${value}`}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Legend 
							wrapperStyle={{ color: '#D1D5DB' }}
						/>
						{/* Sales Line */}
						<Line
							yAxisId='left'
							type='monotone'
							dataKey='sales'
							stroke='#10B981' 
							strokeWidth={2}
							// Styling for regular data points
							dot={{ 
								stroke: '#10B981',
								fill: '#064E3B',
								r: 4,
								strokeWidth: 2
							}}
							// Styling for active (hovered) data points
							activeDot={{ r: 8 }}
							name='Sales'
						/>
						
						{/* Revenue Line */}
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='revenue'
							stroke='#3B82F6'  // Blue color
							strokeWidth={2}
							// Styling for regular data points
							dot={{ 
								stroke: '#3B82F6',
								fill: '#1E3A8A',
								r: 4,
								strokeWidth: 2
							}}
							// Styling for active (hovered) data points
							activeDot={{ r: 8 }}
							name='Revenue'
						/>
					</LineChart>
				</ResponsiveContainer>
			</motion.div>
		</div>
	);
};
export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
	<motion.div
		className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='flex justify-between items-center'>
			<div className='z-10'>
				<p className='text-emerald-300 text-sm mb-1 font-semibold'>{title}</p>
				<h3 className='text-white text-3xl font-bold'>{value}</h3>
			</div>
		</div>
		<div className='absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30' />
		<div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
			<Icon className='h-32 w-32' />
		</div>
	</motion.div>
);