import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Wallet, TrendingUp, IndianRupee, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';
import styles from './Earnings.module.css';
import { Link } from 'react-router-dom';

const Earnings = () => {
    const { earnings } = useAppContext();

    // Dummy transactions for visual effect
    const recentTransactions = [
        { id: 1, type: 'Booking', space: 'Unique Terraces in Mumbai', amount: 1500, date: 'Today, 2:30 PM', status: 'Completed' },
        { id: 2, type: 'Booking', space: 'Affordable Play Areas...', amount: 3000, date: 'Yesterday', status: 'Completed' },
        { id: 3, type: 'Withdrawal', space: 'Bank Transfer', amount: -2000, date: 'Oct 15', status: 'Processing' },
    ];

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Earnings</h1>
                <p className={styles.subtitle}>Track your idle space performance and payouts.</p>
            </div>

            <div className={styles.dashboardGrid}>

                {/* Main Balance Card */}
                <div className={`${styles.card} ${styles.balanceCard}`}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Total Available Balance</h2>
                        <Wallet className={styles.cardIcon} size={24} />
                    </div>
                    <div className={styles.balanceAmount}>
                        <IndianRupee size={36} />
                        <span>{earnings.toLocaleString()}</span>
                    </div>
                    <div className={styles.balanceStats}>
                        <span className={styles.statPositive}>
                            <TrendingUp size={16} /> +12.5% vs last month
                        </span>
                    </div>
                    <button className={`btn ${styles.withdrawBtn}`}>Withdraw Funds</button>
                </div>

                {/* This Week Stats */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Earned This Week</h2>
                        <TrendingUp className={styles.cardIcon} size={24} />
                    </div>
                    <div className={styles.subAmount}>
                        <span>₹1,200</span>
                    </div>
                    <p className={styles.subText}>from 2 bookings</p>
                    <div className={styles.chartMock}>
                        {/* Simple CSS bars to simulate a chart */}
                        <div className={styles.bar} style={{ height: '40%' }}></div>
                        <div className={styles.bar} style={{ height: '20%' }}></div>
                        <div className={styles.bar} style={{ height: '60%' }}></div>
                        <div className={styles.bar} style={{ height: '100%', backgroundColor: 'var(--primary)' }}></div>
                        <div className={styles.bar} style={{ height: '80%' }}></div>
                    </div>
                </div>

                {/* Call to action */}
                <div className={`${styles.card} ${styles.ctaCard}`}>
                    <h3>Got more space?</h3>
                    <p>List another idle space and multiply your earnings.</p>
                    <Link to="/list" className={`btn btn-primary ${styles.ctaBtn}`}>
                        List New Space
                    </Link>
                </div>

            </div>

            {/* Transactions List */}
            <h2 className={styles.sectionTitle}>Recent Transactions</h2>
            <div className={styles.transactionsList}>
                {recentTransactions.map(tx => (
                    <div key={tx.id} className={styles.transactionItem}>
                        <div className={styles.txIconWrapper}>
                            {tx.amount > 0 ? <ArrowUpRight className={styles.txIconIn} /> : <div className={styles.txIconOut}><ArrowUpRight style={{ transform: 'rotate(90deg)' }} /></div>}
                        </div>
                        <div className={styles.txInfo}>
                            <p className={styles.txTitle}>{tx.space}</p>
                            <p className={styles.txDate}>{tx.date}</p>
                        </div>
                        <div className={styles.txStatus}>
                            {tx.status === 'Completed' ? <CheckCircle2 size={16} className={styles.statusCompleted} /> : <Clock size={16} className={styles.statusProcessing} />}
                            <span className={tx.status === 'Completed' ? styles.statusTextCompleted : styles.statusTextProcessing}>{tx.status}</span>
                        </div>
                        <div className={`${styles.txAmount} ${tx.amount > 0 ? styles.amountPositive : ''}`}>
                            {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                        </div>
                    </div>
                ))}
                {earnings > 1200 && (
                    <div className={styles.transactionItem}>
                        <div className={styles.txIconWrapper}>
                            <ArrowUpRight className={styles.txIconIn} />
                        </div>
                        <div className={styles.txInfo}>
                            <p className={styles.txTitle}>New Simulated Booking</p>
                            <p className={styles.txDate}>Just Now</p>
                        </div>
                        <div className={styles.txStatus}>
                            <CheckCircle2 size={16} className={styles.statusCompleted} />
                            <span className={styles.statusTextCompleted}>Completed</span>
                        </div>
                        <div className={`${styles.txAmount} ${styles.amountPositive}`}>
                            +₹{(earnings - 1200).toLocaleString()}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Earnings;
