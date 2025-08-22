"use client"

import { useEffect, useMemo, useState } from "react"
import axiosInstance from "../utils/axiosInstance"
import toast from "react-hot-toast"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label
} from "recharts"

const seasons = ["Kharif", "Rabi", "Summer", "Monsoon", "Winter"]
const yieldUnits = ["kg", "tonnes"]

const emptyForm = {
    cropName: "",
    season: "Kharif",
    date: "",
    area: "",
    areaUnit: "acre",
    yieldAmount: "",
    yieldUnit: "kg",
    pricePerUnit: "",
    expenses: {
        seeds: "",
        fertilizers: "",
        pesticides: "",
        irrigation: "",
        labor: "",
        others: "",
    },
}

export default function FarmAnalytics() {
    const [form, setForm] = useState(emptyForm)
    const [records, setRecords] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(false)

    
    const fetchRecords = async () => {
        setLoading(true)
        try {
            const { data } = await axiosInstance.get("/analytics")
            setRecords(data)
            // Save to localStorage as backup
            localStorage.setItem("farmAnalyticsRecords", JSON.stringify(data))
        } catch (err) {
            console.error("Error fetching records:", err)
            toast.error("Failed to fetch records from server")
            // Fallback to localStorage
            const saved = localStorage.getItem("farmAnalyticsRecords")
            if (saved) {
                setRecords(JSON.parse(saved))
                toast.success("Loaded records from local storage")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRecords()
    }, [])


    const toNumber = (v) => (v === "" || v === null ? 0 : Number(v))
    const normalizeYieldKg = (amount, unit) => (unit === "tonnes" ? toNumber(amount) * 1000 : toNumber(amount))

    const computeDerived = (r) => {
        const yKg = normalizeYieldKg(r.yieldAmount, r.yieldUnit)
        const revenue = yKg * toNumber(r.pricePerUnit)
        const totalExpenses =
            toNumber(r.expenses?.seeds) +
            toNumber(r.expenses?.fertilizers) +
            toNumber(r.expenses?.pesticides) +
            toNumber(r.expenses?.irrigation) +
            toNumber(r.expenses?.labor) +
            toNumber(r.expenses?.others)
        const net = revenue - totalExpenses
        const margin = revenue > 0 ? (net / revenue) * 100 : 0
        return { yKg, revenue, totalExpenses, net, margin }
    }

    const summary = useMemo(() => {
        return records.reduce(
            (acc, r) => {
                const d = computeDerived(r)
                acc.revenue += d.revenue
                acc.expenses += d.totalExpenses
                acc.net += d.net
                return acc
            },
            { revenue: 0, expenses: 0, net: 0 },
        )
    }, [records])

    const handleChange = (path, value) => {
        if (path.startsWith("expenses.")) {
            const key = path.split(".")[1]
            setForm((f) => ({ ...f, expenses: { ...f.expenses, [key]: value } }))
        } else {
            setForm((f) => ({ ...f, [path]: value }))
        }
    }

    const validate = () => {
        if (!form.cropName.trim()) return "Crop name is required"
        if (!form.date) return "Date/Year is required"
        if (Number.isNaN(Number(form.pricePerUnit)) || Number(form.pricePerUnit) < 0)
            return "Price per unit must be a non-negative number"
        if (Number.isNaN(Number(form.yieldAmount)) || Number(form.yieldAmount) < 0)
            return "Yield must be a non-negative number"
        return null
    }

    const handleAdd = async (payload) => {
        setLoading(true)
        try {
            const res = await axiosInstance.post("/analytics", payload)
            toast.success("Record added successfully!")
            setForm(emptyForm)
            fetchRecords()
        } catch (err) {
            console.error("Add failed:", err)
            toast.error("Failed to add record")

            // fallback to localStorage
            const updatedRecords = [{ ...payload, _id: Date.now().toString() }, ...records]
            setRecords(updatedRecords)
            localStorage.setItem("farmAnalyticsRecords", JSON.stringify(updatedRecords))
            toast.success("Record saved locally!")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (id, payload) => {
        setLoading(true)
        try {
            await axiosInstance.put(`/analytics/${id}`, payload)
            toast.success("Record updated successfully!")
            setForm(emptyForm)
            setEditingId(null)
            fetchRecords()
        } catch (err) {
            console.error("Update failed:", err)
            toast.error("Failed to update record")

            // fallback to localStorage
            const updatedRecords = records.map((r) => (r._id === id ? { ...payload, _id: id } : r))
            setRecords(updatedRecords)
            localStorage.setItem("farmAnalyticsRecords", JSON.stringify(updatedRecords))
            toast.success("Record updated locally!")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const err = validate()
        if (err) {
            toast.error(err)
            return
        }

        const payload = {
            ...form,
            area: toNumber(form.area),
            yieldAmount: toNumber(form.yieldAmount),
            pricePerUnit: toNumber(form.pricePerUnit),
            expenses: Object.fromEntries(Object.entries(form.expenses).map(([k, v]) => [k, toNumber(v)])),
        }

        if (editingId) {
            await handleUpdate(editingId, payload)
        } else {
            await handleAdd(payload)
        }
    }

    const handleEdit = (record) => {
        setEditingId(record._id || record.id)
        setForm(record)
    }

    const handleDelete = async (record) => {
        if (!confirm("Delete this record?")) return

        setLoading(true)
        try {
            await axiosInstance.delete(`/analytics/${record._id || record.id}`)
            toast.success("Record deleted successfully!")
            fetchRecords()
        } catch (err) {
            console.error("Delete failed:", err)
            toast.error("Failed to delete record")

            // Fallback to localStorage
            const updatedRecords = records.filter((r) => (r._id || r.id) !== (record._id || record.id))
            setRecords(updatedRecords)
            localStorage.setItem("farmAnalyticsRecords", JSON.stringify(updatedRecords))
            toast.success("Record deleted locally!")
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setEditingId(null)
        setForm(emptyForm)
    }

    // live derived for the form preview
    const live = computeDerived(form)

    // prepare chart data
    const chartData = records.map((r) => {
        const d = computeDerived(r)
        return {
            crop: r.cropName,
            year: new Date(r.date).getFullYear(),
            yield: d.yKg,
            revenue: d.revenue,
            expenses: d.totalExpenses,
            net: d.net,
            margin: d.margin,
        }
    })

    return (
        <div className="mt-15 min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                Farm Analytics Dashboard
                            </h1>
                            <p className="text-slate-600 mt-1">
                                Track yield, expenses, and profits across seasons with detailed analytics
                            </p>
                        </div>
                    </div>
                </header>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {editingId ? "Edit Record" : "Add New Record"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Crop Name</label>
                            <input
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={form.cropName}
                                onChange={(e) => handleChange("cropName", e.target.value)}
                                placeholder="e.g., Wheat, Rice, Corn"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Season</label>
                            <select
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={form.season}
                                onChange={(e) => handleChange("season", e.target.value)}
                            >
                                {seasons.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Date / Year</label>
                            <input
                                type="date"
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={form.date}
                                onChange={(e) => handleChange("date", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Area</label>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    value={form.area}
                                    onChange={(e) => handleChange("area", e.target.value)}
                                    placeholder="e.g., 2"
                                    inputMode="decimal"
                                />
                                <select
                                    className="border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    value={form.areaUnit}
                                    onChange={(e) => handleChange("areaUnit", e.target.value)}
                                >
                                    <option value="acre">acre</option>
                                    <option value="hectare">hectare</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Yield</label>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    value={form.yieldAmount}
                                    onChange={(e) => handleChange("yieldAmount", e.target.value)}
                                    placeholder="e.g., 1200"
                                    inputMode="decimal"
                                />
                                <select
                                    className="border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    value={form.yieldUnit}
                                    onChange={(e) => handleChange("yieldUnit", e.target.value)}
                                >
                                    {yieldUnits.map((u) => (
                                        <option key={u} value={u}>
                                            {u}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Price is calculated per kg</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Price per kg (₹)</label>
                            <input
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={form.pricePerUnit}
                                onChange={(e) => handleChange("pricePerUnit", e.target.value)}
                                placeholder="e.g., 25"
                                inputMode="decimal"
                            />
                        </div>
                    </div>

                    {/* Expenses */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-slate-700 mb-4">Expenses (₹)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            {[
                                ["seeds", "Seeds"],
                                ["fertilizers", "Fertilizers"],
                                ["pesticides", "Pesticides"],
                                ["irrigation", "Irrigation"],
                                ["labor", "Labor"],
                                ["others", "Others"],
                            ].map(([key, label]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
                                    <input
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        value={form.expenses[key]}
                                        onChange={(e) => handleChange(`expenses.${key}`, e.target.value)}
                                        placeholder="0"
                                        inputMode="decimal"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Stat label="Revenue" value={live.revenue} color="green" />
                        <Stat label="Total Expenses" value={live.totalExpenses} color="red" />
                        <Stat label="Net Profit" value={live.net} color={live.net >= 0 ? "green" : "red"} />
                        <Stat
                            label="Profit Margin"
                            value={`${live.margin.toFixed(1)}%`}
                            color={live.margin >= 0 ? "green" : "red"}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-medium hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all"
                        >
                            {loading ? "Saving..." : editingId ? "Update Record" : "Save Record"}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-6 py-3 rounded-lg bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition-all"
                        >
                            Reset
                        </button>
                    </div>
                </form>

                {/* SUMMARY */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        Overall Summary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Stat label="Total Revenue" value={summary.revenue} color="green" />
                        <Stat label="Total Expenses" value={summary.expenses} color="red" />
                        <Stat label="Total Net Profit" value={summary.net} color={summary.net >= 0 ? "green" : "red"} />
                    </div>
                </div>

                {/* Charts */}
                {records.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                            <h2 className="text-xl font-semibold mb-4 text-slate-800">Yield Over Years</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year">
                                        <Label value="Year" offset={0} position="insideBottom" style={{ textAnchor: "middle", fontWeight: "bold" }} />
                                    </XAxis>
                                    <YAxis>
                                        <Label
                                            value="Yield (kg/acre)"
                                            angle={-90}
                                            position="insideLeft"
                                            style={{ textAnchor: "middle", fontWeight: "bold" }}
                                        />
                                    </YAxis>
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="yield" stroke="#4CAF50" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                            <h2 className="text-xl font-semibold mb-4 text-slate-800">Profit Margins by Crop</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="crop">
                                        <Label value="Crop" offset={0} position="insideBottom" style={{ textAnchor: "middle", fontWeight: "bold" }} />
                                    </XAxis>
                                    <YAxis>
                                        <Label
                                            value="Profit Margin (₹)"
                                            angle={-90}
                                            position="insideLeft"
                                            style={{ textAnchor: "middle", fontWeight: "bold" }}
                                        />
                                    </YAxis>
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="margin" fill="#FF9800" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}



                {/* TABLE */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            Records
                        </h2>
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                            {records.length} total
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm" style={{ minWidth: "1200px" }}>
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                                <tr>
                                    <Th>Crop</Th>
                                    <Th>Season</Th>
                                    <Th>Date</Th>
                                    <Th>Area</Th>
                                    <Th>Yield</Th>
                                    <Th>Price/kg</Th>
                                    <Th>Revenue</Th>
                                    <Th>Expenses</Th>
                                    <Th>Net</Th>
                                    <Th>Margin</Th>
                                    <Th>Actions</Th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {records.map((r, idx) => {
                                    const d = computeDerived(r)
                                    return (
                                        <tr key={r._id || idx} className="hover:bg-slate-50 transition-colors">
                                            <Td>{r.cropName}</Td>
                                            <Td>
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                                    {r.season}
                                                </span>
                                            </Td>
                                            <Td>{new Date(r.date).toLocaleDateString()}</Td>
                                            <Td>
                                                {r.area} {r.areaUnit}
                                            </Td>
                                            <Td>
                                                {r.yieldAmount} {r.yieldUnit}
                                            </Td>
                                            <Td>₹{r.pricePerUnit}</Td>
                                            <Td className="text-green-600 font-medium">{formatCurrency(d.revenue)}</Td>
                                            <Td className="text-red-600 font-medium">{formatCurrency(d.totalExpenses)}</Td>
                                            <Td className={`font-medium ${d.net >= 0 ? "text-green-600" : "text-red-600"}`}>
                                                {formatCurrency(d.net)}
                                            </Td>
                                            <Td className={`font-medium ${d.margin >= 0 ? "text-green-600" : "text-red-600"}`}>
                                                {d.margin.toFixed(1)}%
                                            </Td>
                                            <Td>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-xs font-medium"
                                                        onClick={() => handleEdit(r)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-xs font-medium"
                                                        onClick={() => handleDelete(r)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </Td>
                                        </tr>
                                    )
                                })}
                                {records.length === 0 && (
                                    <tr>
                                        <td className="p-8 text-slate-500 italic text-center" colSpan={11}>
                                            <div className="flex flex-col items-center gap-2">
                                                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                No records yet. Add your first farm record above.
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- UI Components ---
const Stat = ({ label, value, color = "slate" }) => {
    const colorClasses = {
        green: "border-green-200 bg-green-50",
        red: "border-red-200 bg-red-50",
        blue: "border-blue-200 bg-blue-50",
        slate: "border-slate-200 bg-slate-50",
    }

    const textColorClasses = {
        green: "text-green-600",
        red: "text-red-600",
        blue: "text-blue-600",
        slate: "text-slate-600",
    }

    return (
        <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
            <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${textColorClasses[color]}`}>
                {typeof value === "number" ? formatCurrency(value) : value}
            </p>
        </div>
    )
}

const Th = ({ children }) => (
    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide text-slate-700 min-w-[120px] whitespace-nowrap">
        {children}
    </th>
)

const Td = ({ children }) => <td className="px-4 py-3 whitespace-nowrap min-w-[120px]">{children}</td>

function formatCurrency(n) {
    if (typeof n !== "number") return n
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(n)
}
