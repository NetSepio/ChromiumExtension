export const downloadMnemonic = (secretKey: string) => {
    const filename = 'mnemonic.txt';
    const blob = new Blob([secretKey], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  