import pandas as pd
import matplotlib.pyplot as plt
import os
import matplotlib

matplotlib.use("Agg")  # headless

LABEL_FILE = "data/labeled_entries.csv"

PARAMS = [
    "Mood Disturbance",
    "Sleep Disruption",
    "Appetite Issues",
    "Academic Disengagement",
    "Social Withdrawal",
]


def generate_weekly_report(user_id: str, start_date: str = None, end_date: str = None):
    # --- Check file existence ---
    if not os.path.exists(LABEL_FILE):
        return {"error": "No labeled data found."}

    df = pd.read_csv(LABEL_FILE)
    if df.empty:
        return {"error": "No data to report."}

    # --- Filter for user ---
    user_entries = df[df["user_id"] == user_id].copy() if "user_id" in df.columns else df.copy()
    if user_entries.empty:
        return {"error": f"No data found for {user_id}"}

    # --- Ensure and clean date column ---
    if "date" not in user_entries.columns:
        return {"error": "Date column missing in labeled_entries.csv"}

    user_entries["date"] = pd.to_datetime(user_entries["date"], errors="coerce")
    user_entries = user_entries.dropna(subset=["date"]).sort_values("date")
    if user_entries.empty:
        return {"error": f"No valid dated entries for {user_id}"}

    # --- Convert PARAMS to numeric (safe) ---
    for p in PARAMS:
        # if column missing, create it with NaNs
        if p not in user_entries.columns:
            user_entries[p] = pd.NA
        user_entries[p] = pd.to_numeric(user_entries[p], errors="coerce")

    # --- Group by calendar day (so multiple entries on same day are averaged) ---
    user_entries["date_only"] = user_entries["date"].dt.normalize()  # midnight timestamp
    daily_grouped = user_entries.groupby("date_only")[PARAMS].mean()

    # --- Decide date range to return ---
    # If caller provided a start/end use it, else use min/max from data
    if start_date:
        start = pd.to_datetime(start_date, errors="coerce")
    else:
        start = daily_grouped.index.min()
    if end_date:
        end = pd.to_datetime(end_date, errors="coerce")
    else:
        end = daily_grouped.index.max()

    # Fallback if parsing failed
    if pd.isna(start) or pd.isna(end):
        start = daily_grouped.index.min()
        end = daily_grouped.index.max()
    if pd.isna(start) or pd.isna(end):
        # no dates at all (very defensive)
        today = pd.Timestamp.now().normalize()
        start = today
        end = today

    if start > end:
        start, end = end, start

    date_index = pd.date_range(start=start.normalize(), end=end.normalize(), freq="D")

    # --- Reindex to full date range so we have one row per calendar day ---
    daily = daily_grouped.reindex(date_index)

    # --- Treat rows that are full-NaN as missing and fill them with neutral 5.0 ---
    # (this keeps real zeros intact)
    daily_filled = daily.fillna(value=pd.NA)
    daily_filled = daily_filled.fillna(5.0)

    daily_filled.index.name = "date"
    daily_data = daily_filled.reset_index()

    # --- Add weekday and average ---
    daily_data["day"] = daily_data["date"].dt.strftime("%a")
    daily_data["average"] = daily_data[PARAMS].mean(axis=1).round(2)

    # --- Weekly averages (average of the days in the returned range) ---
    weekly_avg = daily_data[PARAMS].mean().round(2)
    summary_table = [
        {"Parameter": param, "Weekly Score (out of 10)": float(weekly_avg.get(param, 0))}
        for param in PARAMS
    ]

    # --- Convert dates to ISO strings for JSON/JS consumption ---
    daily_data["date"] = daily_data["date"].dt.strftime("%Y-%m-%d")

    daily_json = daily_data.to_dict(orient="records")

    # --- Plot chart (use parsed dates for x-axis) ---
    # Convert date strings back to datetimes for plotting
    plot_dates = pd.to_datetime([r["date"] for r in daily_json])
    plt.figure(figsize=(10, 6))
    for param in PARAMS:
        yvals = [r.get(param, 5.0) for r in daily_json]
        plt.plot(plot_dates, yvals, marker="o", label=param)

    plt.title(f"Weekly Trends for {user_id}")
    plt.ylabel("Score (0–10)")
    plt.xlabel("Date")
    plt.ylim(0, 10)
    plt.legend()
    plt.grid(True, linestyle="--", alpha=0.6)
    plt.tight_layout()

    chart_file = f"data/{user_id}_weekly_trend.png"
    plt.savefig(chart_file)
    plt.close()

    return {
        "user_id": user_id,
        "weekly_summary": summary_table,
        "chart_file": chart_file,
        "daily_trend": daily_json,
        "daily_records": daily_json,
    }
