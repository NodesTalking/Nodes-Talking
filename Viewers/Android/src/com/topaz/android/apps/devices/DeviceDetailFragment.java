package com.topaz.android.apps.devices;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.topaz.android.apps.devices.device.DeviceContent;
import com.topaz.devices.R;
import com.topaz.nodes.Device;
/**
 * A fragment representing a single Device detail screen. This fragment is
 * either contained in a {@link DeviceListActivity} in two-pane mode (on
 * tablets) or a {@link DeviceDetailActivity} on handsets.
 */
public class DeviceDetailFragment extends Fragment {
	/**
	 * The fragment argument representing the item ID that this fragment
	 * represents.
	 */
	public static final String ARG_ITEM_ID = "device_id";

	/**
	 * The device content this fragment is presenting.
	 */
	private Device mDevice;

	/**
	 * Mandatory empty constructor for the fragment manager to instantiate the
	 * fragment (e.g. upon screen orientation changes).
	 */
	public DeviceDetailFragment() {
	}

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		DeviceContent deviceContent = DeviceContent.getInstance();
		
		if (getArguments().containsKey(ARG_ITEM_ID)) {
			// Load the device content specified by the fragment
			// arguments. In a real-world scenario, use a Loader
			// to load content from a content provider.
			mDevice = deviceContent.DEVICE_MAP.get(getArguments().getString(
					ARG_ITEM_ID));
		}
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		View rootView = inflater.inflate(R.layout.fragment_device_detail,
				container, false);

		// Show the device content.
		if (mDevice != null) {
			((TextView) rootView.findViewById(R.id.device_detail))
					.setText(mDevice.getDescription());
		}

		return rootView;
	}
}