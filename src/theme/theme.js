import { createTheme } from '@mui/material/styles';

// Premium color palette with gradients
const colors = {
    primary: {
        main: '#667eea',
        light: '#8b9cff',
        dark: '#4c63d2',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    secondary: {
        main: '#f093fb',
        light: '#f5a3fc',
        dark: '#e57fe8',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    success: {
        main: '#11998e',
        light: '#38ef7d',
        dark: '#0d7a6f',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    },
    warning: {
        main: '#f5af19',
        light: '#f12711',
        dark: '#c98a15',
        gradient: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
    },
    info: {
        main: '#4facfe',
        light: '#00f2fe',
        dark: '#3d8acc',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    error: {
        main: '#f12711',
        light: '#f5576c',
        dark: '#c11f0e',
        gradient: 'linear-gradient(135deg, #f12711 0%, #f5576c 100%)',
    },
    background: {
        default: '#f8f9fa',
        paper: '#ffffff',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    text: {
        primary: '#2d3748',
        secondary: '#718096',
        disabled: '#a0aec0',
    },
};

// Custom theme with premium styling
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: colors.primary.main,
            light: colors.primary.light,
            dark: colors.primary.dark,
        },
        secondary: {
            main: colors.secondary.main,
            light: colors.secondary.light,
            dark: colors.secondary.dark,
        },
        success: {
            main: colors.success.main,
            light: colors.success.light,
            dark: colors.success.dark,
        },
        warning: {
            main: colors.warning.main,
            light: colors.warning.light,
            dark: colors.warning.dark,
        },
        info: {
            main: colors.info.main,
            light: colors.info.light,
            dark: colors.info.dark,
        },
        error: {
            main: colors.error.main,
            light: colors.error.light,
            dark: colors.error.dark,
        },
        background: {
            default: colors.background.default,
            paper: colors.background.paper,
        },
        text: colors.text,
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01562em',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: 1.3,
            letterSpacing: '-0.00833em',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.4,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4,
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.5,
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.57,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: '0.02857em',
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 4px 8px rgba(0,0,0,0.08)',
        '0px 8px 16px rgba(0,0,0,0.1)',
        '0px 12px 24px rgba(0,0,0,0.12)',
        '0px 16px 32px rgba(0,0,0,0.14)',
        '0px 20px 40px rgba(0,0,0,0.16)',
        '0px 24px 48px rgba(0,0,0,0.18)',
        '0px 28px 56px rgba(0,0,0,0.2)',
        '0px 32px 64px rgba(0,0,0,0.22)',
        '0px 36px 72px rgba(0,0,0,0.24)',
        '0px 40px 80px rgba(0,0,0,0.26)',
        '0px 44px 88px rgba(0,0,0,0.28)',
        '0px 48px 96px rgba(0,0,0,0.3)',
        '0px 52px 104px rgba(0,0,0,0.32)',
        '0px 56px 112px rgba(0,0,0,0.34)',
        '0px 60px 120px rgba(0,0,0,0.36)',
        '0px 64px 128px rgba(0,0,0,0.38)',
        '0px 68px 136px rgba(0,0,0,0.4)',
        '0px 72px 144px rgba(0,0,0,0.42)',
        '0px 76px 152px rgba(0,0,0,0.44)',
        '0px 80px 160px rgba(0,0,0,0.46)',
        '0px 84px 168px rgba(0,0,0,0.48)',
        '0px 88px 176px rgba(0,0,0,0.5)',
        '0px 92px 184px rgba(0,0,0,0.52)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    boxShadow: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                        transform: 'translateY(-2px)',
                    },
                },
                contained: {
                    background: colors.primary.gradient,
                    color: '#ffffff',
                    '&:hover': {
                        background: colors.primary.gradient,
                        opacity: 0.9,
                    },
                },
                containedSecondary: {
                    background: colors.secondary.gradient,
                },
                containedSuccess: {
                    background: colors.success.gradient,
                },
                containedError: {
                    background: colors.error.gradient,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0px 8px 30px rgba(0,0,0,0.12)',
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
                elevation1: {
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
                },
                elevation2: {
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
                },
                elevation3: {
                    boxShadow: '0px 6px 16px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
                        },
                        '&.Mui-focused': {
                            boxShadow: '0px 4px 12px rgba(102, 126, 234, 0.2)',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                },
                colorSuccess: {
                    background: colors.success.gradient,
                    color: '#ffffff',
                },
                colorError: {
                    background: colors.error.gradient,
                    color: '#ffffff',
                },
                colorWarning: {
                    background: colors.warning.gradient,
                    color: '#ffffff',
                },
                colorInfo: {
                    background: colors.info.gradient,
                    color: '#ffffff',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: colors.primary.gradient,
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 700,
                    backgroundColor: '#f8f9fa',
                    color: colors.text.primary,
                },
            },
        },
    },
});

// Export colors for use in custom components
export { colors };
export default theme;
