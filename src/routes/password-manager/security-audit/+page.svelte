<script lang="ts">
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import { goto } from '$app/navigation';
	import { 
		ArrowLeft, 
		Shield, 
		AlertTriangle, 
		AlertCircle, 
		CheckCircle2, 
		RefreshCw,
		Eye,
		Copy,
		Clock,
		TrendingUp,
		TrendingDown,
		Minus
	} from '@lucide/svelte';

	// Security audit state
	let isRunningAudit = $state(false);
	let lastAuditDate = $state<Date | null>(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)); // 2 days ago
	let auditResults = $state({
		overallScore: 72,
		totalPasswords: 45,
		issues: [
			{
				type: 'weak' as const,
				severity: 'high' as const,
				title: 'Weak Passwords Detected',
				description: '8 passwords are considered weak and should be updated',
				affectedEntries: ['entry1', 'entry2', 'entry3', 'entry4', 'entry5', 'entry6', 'entry7', 'entry8'],
				recommendation: 'Generate stronger passwords with at least 12 characters'
			},
			{
				type: 'reused' as const,
				severity: 'medium' as const,
				title: 'Password Reuse Found',
				description: '5 passwords are being reused across multiple accounts',
				affectedEntries: ['entry9', 'entry10', 'entry11', 'entry12', 'entry13'],
				recommendation: 'Use unique passwords for each account'
			},
			{
				type: 'old' as const,
				severity: 'medium' as const,
				title: 'Old Passwords',
				description: '12 passwords haven\'t been changed in over 6 months',
				affectedEntries: Array.from({length: 12}, (_, i) => `entry${i + 14}`),
				recommendation: 'Update old passwords regularly, especially for important accounts'
			},
			{
				type: 'compromised' as const,
				severity: 'critical' as const,
				title: 'Potentially Compromised',
				description: '2 passwords appear in known data breaches',
				affectedEntries: ['entry26', 'entry27'],
				recommendation: 'Change these passwords immediately'
			}
		],
		trends: [
			{
				metric: 'average_strength' as const,
				value: 72,
				previousValue: 68,
				trend: 'improving' as const,
				period: '30 days'
			},
			{
				metric: 'reuse_count' as const,
				value: 5,
				previousValue: 8,
				trend: 'improving' as const,
				period: '30 days'
			},
			{
				metric: 'password_age' as const,
				value: 145,
				previousValue: 132,
				trend: 'declining' as const,
				period: '30 days'
			}
		]
	});

	// Run security audit
	async function runSecurityAudit() {
		isRunningAudit = true;
		
		// Simulate audit process
		await new Promise(resolve => setTimeout(resolve, 3000));
		
		// Update last audit date
		lastAuditDate = new Date();
		
		// Simulate slight improvements
		auditResults.overallScore = Math.min(100, auditResults.overallScore + Math.floor(Math.random() * 5));
		
		isRunningAudit = false;
	}

	// Get severity color
	function getSeverityColor(severity: string) {
		switch (severity) {
			case 'critical': return 'text-red-500';
			case 'high': return 'text-orange-500';
			case 'medium': return 'text-yellow-500';
			case 'low': return 'text-blue-500';
			default: return 'text-gray-400';
		}
	}

	// Get severity background
	function getSeverityBg(severity: string) {
		switch (severity) {
			case 'critical': return 'bg-red-500/10';
			case 'high': return 'bg-orange-500/10';
			case 'medium': return 'bg-yellow-500/10';
			case 'low': return 'bg-blue-500/10';
			default: return 'bg-gray-500/10';
		}
	}

	// Get score color
	function getScoreColor(score: number) {
		if (score >= 85) return 'text-green-500';
		if (score >= 70) return 'text-blue-500';
		if (score >= 50) return 'text-yellow-500';
		return 'text-red-500';
	}

	// Get score background
	function getScoreBg(score: number) {
		if (score >= 85) return 'bg-green-500';
		if (score >= 70) return 'bg-blue-500';
		if (score >= 50) return 'bg-yellow-500';
		return 'bg-red-500';
	}

	// Get trend icon
	function getTrendIcon(trend: string) {
		switch (trend) {
			case 'improving': return TrendingUp;
			case 'declining': return TrendingDown;
			default: return Minus;
		}
	}

	// Get trend color
	function getTrendColor(trend: string) {
		switch (trend) {
			case 'improving': return 'text-green-500';
			case 'declining': return 'text-red-500';
			default: return 'text-gray-400';
		}
	}

	// Format metric name
	function formatMetricName(metric: string) {
		return metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
	}

	// Get issue icon
	function getIssueIcon(type: string) {
		switch (type) {
			case 'compromised': return AlertTriangle;
			case 'weak': return Shield;
			case 'reused': return Copy;
			case 'old': return Clock;
			default: return AlertCircle;
		}
	}
</script>

<VpnHeader />

<div class="absolute top-0 left-0 right-0 z-10 bg-gray-900 border-b border-gray-700 p-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<button
				onclick={() => goto('/password-manager')}
				class="p-2 hover:bg-gray-800 rounded-lg transition-colors"
			>
				<ArrowLeft class="w-5 h-5 text-gray-400" />
			</button>
			<div class="flex items-center gap-2">
				<Shield class="w-6 h-6 text-[#00ccba]" />
				<h1 class="text-lg font-semibold text-white">Security Audit</h1>
			</div>
		</div>
		<button
			onclick={runSecurityAudit}
			disabled={isRunningAudit}
			class="flex items-center gap-2 px-3 py-1.5 bg-[#00ccba] hover:bg-[#00b5a5] disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
		>
			<RefreshCw class="w-4 h-4 {isRunningAudit ? 'animate-spin' : ''}" />
			{isRunningAudit ? 'Scanning...' : 'Run Audit'}
		</button>
	</div>
</div>

<div class="pt-20 flex-1 bg-gray-900 p-4 space-y-6 overflow-y-auto">
	<!-- Overall Security Score -->
	<div class="bg-gray-800 rounded-lg p-6">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-white font-semibold">Overall Security Score</h2>
			{#if lastAuditDate}
				<span class="text-sm text-gray-400">
					Last audit: {lastAuditDate.toLocaleDateString()}
				</span>
			{/if}
		</div>

		<div class="flex items-center gap-6">
			<div class="relative w-24 h-24">
				<div class="w-full h-full bg-gray-700 rounded-full p-2">
					<div class="w-full h-full bg-gray-800 rounded-full flex items-center justify-center">
						<span class="text-2xl font-bold {getScoreColor(auditResults.overallScore)}">
							{auditResults.overallScore}
						</span>
					</div>
				</div>
				<div class="absolute inset-0 rounded-full" style="background: conic-gradient(from 0deg, {auditResults.overallScore >= 85 ? '#10b981' : auditResults.overallScore >= 70 ? '#3b82f6' : auditResults.overallScore >= 50 ? '#eab308' : '#ef4444'} {auditResults.overallScore * 3.6}deg, transparent 0deg)"></div>
			</div>
			
			<div class="flex-1">
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span class="text-gray-400">Total Passwords</span>
						<div class="text-white font-semibold">{auditResults.totalPasswords}</div>
					</div>
					<div>
						<span class="text-gray-400">Issues Found</span>
						<div class="text-white font-semibold">{auditResults.issues.length}</div>
					</div>
				</div>
				
				<div class="mt-4">
					<div class="w-full bg-gray-700 rounded-full h-2">
						<div 
							class="h-2 rounded-full transition-all duration-500 {getScoreBg(auditResults.overallScore)}"
							style="width: {auditResults.overallScore}%"
						></div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Security Issues -->
	<div class="bg-gray-800 rounded-lg p-4">
		<h3 class="text-white font-semibold mb-4">Security Issues</h3>
		
		{#if auditResults.issues.length === 0}
			<div class="flex items-center justify-center py-8 text-gray-400">
				<CheckCircle2 class="w-8 h-8 text-green-500 mr-3" />
				<span>No security issues found. Great job!</span>
			</div>
		{:else}
			<div class="space-y-3">
				{#each auditResults.issues as issue}
					{@const Icon = getIssueIcon(issue.type)}
					<div class="border border-gray-700 rounded-lg p-4 {getSeverityBg(issue.severity)}">
						<div class="flex items-start justify-between mb-2">
							<div class="flex items-center gap-3">
								<Icon class="w-5 h-5 {getSeverityColor(issue.severity)}" />
								<h4 class="text-white font-medium">{issue.title}</h4>
							</div>
							<span class="px-2 py-1 text-xs rounded-full bg-gray-700 {getSeverityColor(issue.severity)} capitalize">
								{issue.severity}
							</span>
						</div>
						
						<p class="text-gray-300 text-sm mb-3">{issue.description}</p>
						
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-400">
								Affects {issue.affectedEntries.length} password{issue.affectedEntries.length !== 1 ? 's' : ''}
							</span>
							<button class="flex items-center gap-1 text-sm text-[#00ccba] hover:text-[#00b5a5] transition-colors">
								<Eye class="w-4 h-4" />
								View Details
							</button>
						</div>
						
						<div class="mt-3 p-3 bg-gray-700/50 rounded-lg">
							<p class="text-sm text-gray-300">
								<strong>Recommendation:</strong> {issue.recommendation}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Security Trends -->
	<div class="bg-gray-800 rounded-lg p-4">
		<h3 class="text-white font-semibold mb-4">Security Trends</h3>
		
		<div class="grid gap-4">
			{#each auditResults.trends as trend}
				{@const TrendIcon = getTrendIcon(trend.trend)}
				<div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
					<div class="flex items-center gap-3">
						<TrendIcon class="w-5 h-5 {getTrendColor(trend.trend)}" />
						<div>
							<div class="text-white font-medium">{formatMetricName(trend.metric)}</div>
							<div class="text-sm text-gray-400">{trend.period}</div>
						</div>
					</div>
					
					<div class="text-right">
						<div class="text-white font-semibold">
							{trend.metric === 'password_age' ? `${trend.value} days` : trend.value}
						</div>
						{#if trend.previousValue !== undefined}
							<div class="text-sm {getTrendColor(trend.trend)}">
								{trend.trend === 'improving' ? '+' : trend.trend === 'declining' ? '-' : ''}
								{Math.abs(trend.value - trend.previousValue)}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="bg-gray-800 rounded-lg p-4">
		<h3 class="text-white font-semibold mb-4">Quick Actions</h3>
		
		<div class="grid grid-cols-1 gap-3">
			<button
				onclick={() => goto('/password-manager/vault?filter=weak')}
				class="flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
			>
				<div class="flex items-center gap-3">
					<Shield class="w-5 h-5 text-orange-500" />
					<span class="text-white">Review Weak Passwords</span>
				</div>
				<span class="text-sm text-gray-400">8 passwords</span>
			</button>
			
			<button
				onclick={() => goto('/password-manager/vault?filter=reused')}
				class="flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
			>
				<div class="flex items-center gap-3">
					<Copy class="w-5 h-5 text-yellow-500" />
					<span class="text-white">Fix Reused Passwords</span>
				</div>
				<span class="text-sm text-gray-400">5 passwords</span>
			</button>
			
			<button
				onclick={() => goto('/password-manager/vault?filter=old')}
				class="flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
			>
				<div class="flex items-center gap-3">
					<Clock class="w-5 h-5 text-blue-500" />
					<span class="text-white">Update Old Passwords</span>
				</div>
				<span class="text-sm text-gray-400">12 passwords</span>
			</button>
			
			<button
				onclick={() => goto('/password-manager/vault?filter=compromised')}
				class="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition-colors"
			>
				<div class="flex items-center gap-3">
					<AlertTriangle class="w-5 h-5 text-red-500" />
					<span class="text-white">Review Compromised Passwords</span>
				</div>
				<span class="text-sm text-red-400">2 passwords</span>
			</button>
		</div>
	</div>
</div>
