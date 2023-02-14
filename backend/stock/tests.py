import json

from django.test import TestCase
from django.urls import reverse


class StockRetrieveUpdateDestroyTestCase(TestCase):
    def test_retrieve(self):
        """_summary_
        Test GET (retrieve) request.
        """
        response = self.client.get(reverse("stock-rud", args=["NFLX"]))
        self.assertEqual(response.status_code, 200)
