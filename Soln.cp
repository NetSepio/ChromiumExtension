#include<bits/stdc++.h>
using namespace std;
#define ll long long
int main() {
    int V;
    cin >> V;
    while (V--) {
        int N;
        cin >> N;
        int arr[N];
        for (int i = 0; i < N; i++) cin >> arr[i];
        int sum = 0;
        int flag = 0;
        unordered_set<int> s;
        for (int i = 0; i < N; i++) {
            sum += arr[i];

            if (sum == 0 || s.find(sum) != s.end()) {
                flag = 1;
                break;
            }
            s.insert(sum);
        }
        if (flag) {
            cout << "yes\n";
        }
        else cout << "no\n";

    }
    return 0;
}