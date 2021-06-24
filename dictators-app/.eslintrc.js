module.exports = {
    extends: ['airbnb-typescript'],
    parserOptions: {
        project: './tsconfig.json',
    },
    "rules": {
        "jsx-a11y/anchor-is-valid": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "react/prop-types": "off"
    }
};