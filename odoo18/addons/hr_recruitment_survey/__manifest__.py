# -*- coding: utf-8 -*-
{
    'name': "Hr Recruitment Interview Forms",
    'version': '1.0',
    'category': 'Human Resources',
    'summary': 'Surveys',
    'description': """
Use interview forms during recruitment process.
This module is integrated with the survey module
to allow you to define interviews for different jobs.
    """,
    'depends': ['survey', 'hr_recruitment'],
    'data': [
        'security/ir.model.access.csv',
        'security/hr_recruitment_survey_security.xml',
        'data/mail_template_data.xml',
        'views/hr_job_views.xml',
        'views/hr_applicant_views.xml',
        'views/res_config_setting_views.xml',
        'views/survey_survey_views.xml',
        'views/survey_templates_statistics.xml',
    ],
    'demo': [
        'data/survey_demo.xml',
        'data/hr_job_demo.xml',
    ],
    'license': 'LGPL-3',
}
